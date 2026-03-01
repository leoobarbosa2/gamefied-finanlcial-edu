import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { X } from 'lucide-react-native'
import { ProgressBar } from '../progress/ProgressBar'

interface LessonTopBarProps {
  currentStep: number
  totalSteps: number
  onExit: () => void
}

export function LessonTopBar({ currentStep, totalSteps, onExit }: LessonTopBarProps) {
  const pct = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <TouchableOpacity onPress={onExit} className="p-1">
        <X size={22} color="#71717a" />
      </TouchableOpacity>
      <View className="flex-1">
        <ProgressBar value={pct} />
      </View>
      <Text className="text-xs text-[#71717a] dark:text-[#8b8b98] w-10 text-right">
        {currentStep}/{totalSteps}
      </Text>
    </View>
  )
}
