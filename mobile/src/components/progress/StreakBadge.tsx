import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { Flame } from 'lucide-react-native'

interface StreakBadgeProps {
  streak: number
  large?: boolean
}

export function StreakBadge({ streak, large = false }: StreakBadgeProps) {
  const scale = useSharedValue(1)
  const haloOpacity = useSharedValue(0.5)

  useEffect(() => {
    if (streak > 0) {
      scale.value = withRepeat(
        withSequence(
          withSpring(1.25, { damping: 8, stiffness: 200 }),
          withSpring(1.0,  { damping: 12, stiffness: 200 })
        ),
        -1,
        false
      )
      haloOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 500 }),
          withTiming(0.2, { duration: 500 })
        ),
        -1,
        false
      )
    }
  }, [streak])

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const haloStyle = useAnimatedStyle(() => ({
    opacity: haloOpacity.value,
  }))

  const iconSize = large ? 28 : 18
  const fontSize = large ? 20 : 14

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {/* Halo ring behind flame */}
      <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[haloStyle, {
          position: 'absolute',
          width: iconSize + 10,
          height: iconSize + 10,
          borderRadius: 999,
          backgroundColor: '#fed7aa',
        }]} />
        <Animated.View style={flameStyle}>
          <Flame size={iconSize} color="#f97316" fill="#f97316" />
        </Animated.View>
      </View>
      <Text style={{ fontSize, fontWeight: '800', color: '#f97316' }}>
        {streak}
      </Text>
    </View>
  )
}
