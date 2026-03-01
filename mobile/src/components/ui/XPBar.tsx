import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { xpForLevel, xpProgress } from '../../utils/xp'
import { cn } from '../../utils/cn'

interface XPBarProps {
  xp: number
  level: number
  className?: string
  compact?: boolean
}

export function XPBar({ xp, level, className, compact = false }: XPBarProps) {
  const pct = xpProgress(xp, level)
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withTiming(pct * 100, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    })
  }, [pct])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  const nextLevelXp = xpForLevel(level)
  const currentLevelXp = xpForLevel(level - 1)
  const xpInLevel = xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp

  return (
    <View className={cn('', className)}>
      {!compact && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs font-medium text-[#71717a] dark:text-[#8b8b98]">
            Nível {level}
          </Text>
          <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">
            {xpInLevel} / {xpNeeded} XP
          </Text>
        </View>
      )}
      <View className="h-2 bg-[#e4e4e7] dark:bg-[#2a2a32] rounded-full overflow-hidden">
        <Animated.View
          style={animatedStyle}
          className="h-full bg-accent-500 rounded-full"
        />
      </View>
    </View>
  )
}
