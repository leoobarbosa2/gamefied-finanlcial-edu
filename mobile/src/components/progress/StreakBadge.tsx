import React from 'react'
import { View, Text } from 'react-native'
import { Flame } from 'lucide-react-native'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Flame size={16} color="#f97316" fill="#f97316" />
      <Text className="text-sm font-semibold text-orange-500">{streak}</Text>
    </View>
  )
}
