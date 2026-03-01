import React from 'react'
import { View } from 'react-native'
import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number  // 0–100
  className?: string
  trackClassName?: string
  fillClassName?: string
}

export function ProgressBar({ value, className, trackClassName, fillClassName }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <View className={cn('h-2 rounded-full overflow-hidden', className)}>
      <View
        className={cn('h-full bg-[#e4e4e7] dark:bg-[#2a2a32] rounded-full', trackClassName)}
      />
      <View
        className={cn('h-full bg-accent-500 rounded-full absolute top-0 left-0', fillClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </View>
  )
}
