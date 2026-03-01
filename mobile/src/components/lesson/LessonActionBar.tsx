import React from 'react'
import { View } from 'react-native'
import { Button } from '../ui/Button'
import type { PlayerStatus } from '../../store/lessonStore'
import type { LessonStep } from '../../types'

interface LessonActionBarProps {
  step: LessonStep
  playerStatus: PlayerStatus
  selectedOptionId: string | null
  currentStepIndex: number
  totalSteps: number
  onVerify: () => void
  onContinue: () => void
  onComplete: () => void
}

export function LessonActionBar({
  step,
  playerStatus,
  selectedOptionId,
  currentStepIndex,
  totalSteps,
  onVerify,
  onContinue,
  onComplete,
}: LessonActionBarProps) {
  const isLastStep = currentStepIndex === totalSteps - 1
  const isAnswered = playerStatus === 'correct' || playerStatus === 'incorrect'
  const isChecking = playerStatus === 'checking'

  const showVerify = step.stepType === 'QUIZ' && !isAnswered
  const showContinue = (step.stepType !== 'QUIZ' || isAnswered) && !isLastStep
  const showComplete = (step.stepType !== 'QUIZ' || isAnswered) && isLastStep

  return (
    <View className="px-5 pb-6 pt-3 bg-white dark:bg-[#1c1c22] border-t border-[#e4e4e7] dark:border-[#2a2a32]">
      {showVerify && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedOptionId}
          loading={isChecking}
          onPress={onVerify}
        >
          Verificar
        </Button>
      )}
      {showContinue && (
        <Button variant="primary" size="lg" fullWidth onPress={onContinue}>
          Continuar
        </Button>
      )}
      {showComplete && (
        <Button variant="primary" size="lg" fullWidth onPress={onComplete}>
          Concluir lição
        </Button>
      )}
    </View>
  )
}
