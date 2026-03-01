import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { QuizOption } from './QuizOption'
import { useLessonStore } from '../../store/lessonStore'
import type { LessonStep } from '../../types'

interface QuizBlockProps {
  step: LessonStep
}

export function QuizBlock({ step }: QuizBlockProps) {
  const { playerStatus, selectedOptionId, answerResult, selectOption } = useLessonStore()
  const question = step.questions[0]

  if (!question) return null

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xs font-semibold text-accent-500 uppercase tracking-widest mb-3">
        Questão
      </Text>
      <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5] leading-snug mb-6">
        {question.questionText}
      </Text>

      <View>
        {question.options.map((option) => (
          <QuizOption
            key={option.id}
            text={option.text}
            optionId={option.id}
            playerStatus={playerStatus}
            selectedOptionId={selectedOptionId}
            correctOptionId={answerResult?.correctOptionId ?? null}
            onSelect={selectOption}
          />
        ))}
      </View>
    </ScrollView>
  )
}
