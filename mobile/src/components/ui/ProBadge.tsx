import React from 'react'
import { View, Text } from 'react-native'
import { cn } from '../../utils/cn'

interface ProBadgeProps {
  className?: string
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <View
      className={cn(
        'bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full',
        className
      )}
    >
      <Text className="text-xs font-bold text-amber-700 dark:text-amber-300 tracking-wide">
        ✦ PRO
      </Text>
    </View>
  )
}
