import React, { useEffect, useState } from 'react'
import { View, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { lessonsApi } from '../../../src/api/lessons'
import { useLessonStore } from '../../../src/store/lessonStore'
import { useAuthStore } from '../../../src/store/authStore'
import { LessonTopBar } from '../../../src/components/lesson/LessonTopBar'
import { LessonContent } from '../../../src/components/lesson/LessonContent'
import { LessonActionBar } from '../../../src/components/lesson/LessonActionBar'
import { ResultFeedback } from '../../../src/components/lesson/ResultFeedback'
import { LessonComplete } from '../../../src/components/lesson/LessonComplete'
import { Skeleton } from '../../../src/components/ui/Skeleton'
import type { CompleteLessonResult } from '../../../src/types'

export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)

  const {
    lesson,
    steps,
    currentStepIndex,
    totalSteps,
    playerStatus,
    selectedOptionId,
    answerResult,
    initLesson,
    selectOption,
    submitAnswer,
    advanceStep,
    completeLesson,
    resetLesson,
  } = useLessonStore()

  const [completionResult, setCompletionResult] = useState<CompleteLessonResult | null>(null)
  const [finalScore, setFinalScore] = useState(0)

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const data = await lessonsApi.getOne(id!)
      await lessonsApi.start(id!)
      return data
    },
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (lessonData && (!lesson || lesson.id !== lessonData.id)) {
      initLesson(lessonData)
    }
  }, [lessonData])

  useEffect(() => {
    return () => {
      resetLesson()
    }
  }, [])

  const handleExit = () => {
    Alert.alert(
      'Sair da lição?',
      'Seu progresso nesta lição não será salvo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => router.back() },
      ]
    )
  }

  const handleVerify = () => {
    const step = steps[currentStepIndex]
    const question = step.questions[0]
    if (!question) return
    submitAnswer(lesson!.id, step.id, question.id)
  }

  const handleContinue = () => {
    advanceStep()
  }

  const handleComplete = async () => {
    if (!lesson) return
    const correctCount = useLessonStore.getState().correctCount
    const quizSteps = steps.filter((s) => s.stepType === 'QUIZ').length
    const score = quizSteps > 0 ? Math.round((correctCount / quizSteps) * 100) : 100
    setFinalScore(score)

    const result = await completeLesson(lesson.id)
    if (result) {
      setCompletionResult(result)
      updateUser({ xp: result.newXp, level: result.newLevel, coins: undefined })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['path'] })
    }
  }

  const handleBack = () => {
    router.back()
  }

  const currentStep = steps[currentStepIndex]

  if (isLoading || !currentStep) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-[#1c1c22]">
        <View className="px-4 pt-4 gap-4">
          <Skeleton className="h-8 rounded-full" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </View>
      </SafeAreaView>
    )
  }

  if (playerStatus === 'complete' && completionResult && lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-[#1c1c22]">
        <LessonComplete
          lesson={lesson}
          result={completionResult}
          score={finalScore}
          onBack={handleBack}
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#1c1c22]">
      <LessonTopBar
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        onExit={handleExit}
      />

      <View className="flex-1">
        <LessonContent step={currentStep} />
      </View>

      <ResultFeedback
        playerStatus={playerStatus}
        answerResult={answerResult}
      />

      <LessonActionBar
        step={currentStep}
        playerStatus={playerStatus}
        selectedOptionId={selectedOptionId}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onVerify={handleVerify}
        onContinue={handleContinue}
        onComplete={handleComplete}
      />
    </SafeAreaView>
  )
}
