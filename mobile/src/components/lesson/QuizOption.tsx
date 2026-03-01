import React from 'react'
import { TouchableOpacity, Text, View } from 'react-native'
import { Check, X } from 'lucide-react-native'
import type { PlayerStatus } from '../../store/lessonStore'

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect'

interface QuizOptionProps {
  text: string
  optionId: string
  playerStatus: PlayerStatus
  selectedOptionId: string | null
  correctOptionId: string | null
  onSelect: (id: string) => void
}

export function QuizOption({
  text,
  optionId,
  playerStatus,
  selectedOptionId,
  correctOptionId,
  onSelect,
}: QuizOptionProps) {
  const isSelected = selectedOptionId === optionId
  const isAnswered = playerStatus === 'correct' || playerStatus === 'incorrect'

  let state: OptionState = 'idle'
  if (isAnswered) {
    if (optionId === correctOptionId) state = 'correct'
    else if (isSelected) state = 'incorrect'
  } else if (isSelected) {
    state = 'selected'
  }

  const containerClass = {
    idle:      'border border-[#e4e4e7] dark:border-[#2a2a32] bg-white dark:bg-[#24242c]',
    selected:  'border-2 border-accent-500 bg-accent-50 dark:bg-accent-900/30',
    correct:   'border-2 border-[#16a34a] bg-[#f0fdf4] dark:border-[#4ade80] dark:bg-[#052e16]',
    incorrect: 'border-2 border-[#e11d48] bg-[#fff1f2] dark:border-[#fb7185] dark:bg-[#4c0519]',
  }[state]

  const textClass = {
    idle:      'text-[#09090b] dark:text-[#f4f4f5]',
    selected:  'text-accent-700 dark:text-accent-300',
    correct:   'text-[#16a34a] dark:text-[#4ade80] font-semibold',
    incorrect: 'text-[#e11d48] dark:text-[#fb7185]',
  }[state]

  const isDisabled = isAnswered || playerStatus === 'checking'

  return (
    <TouchableOpacity
      onPress={() => !isDisabled && onSelect(optionId)}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`flex-row items-center gap-3 rounded-2xl px-4 py-4 mb-3 ${containerClass}`}
    >
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          state === 'correct'
            ? 'bg-[#16a34a] border-[#16a34a] dark:bg-[#4ade80] dark:border-[#4ade80]'
            : state === 'incorrect'
            ? 'bg-[#e11d48] border-[#e11d48] dark:bg-[#fb7185] dark:border-[#fb7185]'
            : state === 'selected'
            ? 'border-accent-500 bg-accent-500'
            : 'border-[#d4d4d8] dark:border-[#3d3d4a]'
        }`}
      >
        {state === 'correct' && <Check size={12} color="white" strokeWidth={3} />}
        {state === 'incorrect' && <X size={12} color="white" strokeWidth={3} />}
      </View>
      <Text className={`flex-1 text-base ${textClass}`}>{text}</Text>
    </TouchableOpacity>
  )
}
