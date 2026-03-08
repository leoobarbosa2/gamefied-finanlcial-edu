import React, { useEffect, useRef } from 'react'
import { View, Text, useColorScheme } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { cn } from '../../utils/cn'

interface CoinsBadgeProps {
  coins: number
  size?: 'sm' | 'md'
  className?: string
}

export function CoinsBadge({ coins, size = 'md', className }: CoinsBadgeProps) {
  const isDark = useColorScheme() === 'dark'
  const prevCoins = useRef(coins)
  const rotate = useSharedValue(0)

  useEffect(() => {
    if (prevCoins.current !== coins) {
      prevCoins.current = coins
      rotate.value = withSequence(
        withTiming(10,  { duration: 70 }),
        withTiming(-10, { duration: 70 }),
        withTiming(7,   { duration: 55 }),
        withTiming(-7,  { duration: 55 }),
        withTiming(0,   { duration: 55 })
      )
    }
  }, [coins])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))

  const iconSize = size === 'sm' ? 13 : 15
  const fontSize = size === 'sm' ? 11 : 13
  const bg = isDark ? 'rgba(120,53,15,0.4)' : '#fef3c7'
  const borderColor = isDark ? '#92400e' : '#fcd34d'

  return (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: bg, borderWidth: 1.5, borderColor,
        paddingHorizontal: size === 'sm' ? 8 : 10,
        paddingVertical: size === 'sm' ? 3 : 5,
        borderRadius: 999,
      }}
      className={className}
    >
      <Animated.Text style={[animStyle, { fontSize: iconSize + 2 }]}>🪙</Animated.Text>
      <Text style={{ fontSize, fontWeight: '800', color: isDark ? '#fbbf24' : '#b45309' }}>
        {coins}
      </Text>
    </View>
  )
}
