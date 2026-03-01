import React from 'react'
import { View, Text } from 'react-native'
import { Coins } from 'lucide-react-native'
import { cn } from '../../utils/cn'

interface CoinsBadgeProps {
  coins: number
  size?: 'sm' | 'md'
  className?: string
}

export function CoinsBadge({ coins, size = 'md', className }: CoinsBadgeProps) {
  const iconSize = size === 'sm' ? 14 : 16
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <View
      className={cn(
        'flex-row items-center gap-1 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-full',
        className
      )}
    >
      <Coins size={iconSize} color="#d97706" />
      <Text className={cn('font-semibold text-amber-600 dark:text-amber-400', textClass)}>
        {coins}
      </Text>
    </View>
  )
}
