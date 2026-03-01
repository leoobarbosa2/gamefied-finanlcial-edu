import React from 'react'
import { View, Text } from 'react-native'
import { ReadingBlock } from './ReadingBlock'
import { QuizBlock } from './QuizBlock'
import { ReflectBlock } from './ReflectBlock'
import type { LessonStep } from '../../types'

interface LessonContentProps {
  step: LessonStep
}

export function LessonContent({ step }: LessonContentProps) {
  switch (step.stepType) {
    case 'READ':
      return <ReadingBlock content={step.content as any} />
    case 'QUIZ':
      return <QuizBlock step={step} />
    case 'REFLECT':
      return <ReflectBlock content={step.content as any} />
    default:
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-[#71717a]">Tipo de passo desconhecido</Text>
        </View>
      )
  }
}
