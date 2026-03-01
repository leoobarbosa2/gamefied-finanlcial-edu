import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '../../utils/cn'

interface LevelBadgeProps {
  level: number
  className?: string
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <View
      className={cn(
        'w-8 h-8 rounded-full bg-accent-500 items-center justify-center',
        className
      )}
    >
      <Text className="text-xs font-bold text-white">{level}</Text>
    </View>
  )
}
