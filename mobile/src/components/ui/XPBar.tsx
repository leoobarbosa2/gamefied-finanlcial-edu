import React, { useEffect } from 'react'
import { View, Text, useColorScheme } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
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
  const isDark = useColorScheme() === 'dark'
  const pct = xpProgress(xp, level)
  const width = useSharedValue(0)
  const glowOpacity = useSharedValue(0.3)

  useEffect(() => {
    width.value = withSpring(pct * 100, { damping: 18, stiffness: 80 })
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    )
  }, [pct])

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value}%` }))
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }))

  const nextLevelXp = xpForLevel(level)
  const currentLevelXp = xpForLevel(level - 1)
  const xpInLevel = xp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp

  return (
    <View className={cn('', className)}>
      {!compact && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#14b8a6', letterSpacing: 0.3 }}>
            NÍV. {level}
          </Text>
          <Text style={{ fontSize: 11, color: isDark ? '#8b8b98' : '#71717a' }}>
            {xpInLevel} / {xpNeeded} XP
          </Text>
        </View>
      )}
      <View style={{
        height: 12,
        backgroundColor: isDark ? '#2a2a32' : '#e4e4e7',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        {/* Glow layer */}
        <Animated.View style={[glowStyle, {
          position: 'absolute', top: -3, bottom: -3, left: 0,
          width: `${pct * 100}%`, backgroundColor: '#5eead4', borderRadius: 999,
        }]} />
        {/* Fill */}
        <Animated.View style={[fillStyle, {
          height: '100%', backgroundColor: '#14b8a6', borderRadius: 999,
        }]} />
        {/* Shine strip */}
        <Animated.View style={[fillStyle, {
          position: 'absolute', top: 0, height: '40%',
          borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.28)',
        }]} />
      </View>
    </View>
  )
}
