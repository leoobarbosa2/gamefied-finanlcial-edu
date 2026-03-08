import React, { useEffect } from 'react'
import { View, Text, useColorScheme } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { StreakBadge } from '../progress/StreakBadge'
import type { StreakData } from '../../types'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function DayCircle({ active, today, label, index }: {
  active: boolean
  today: boolean
  label: string
  index: number
}) {
  const isDark = useColorScheme() === 'dark'
  const scale = useSharedValue(0.5)
  const opacity = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(index * 60, withSpring(1, { damping: 14, stiffness: 200 }))
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 250 }))
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  let bg = isDark ? '#2e2e38' : '#f3f4f6'
  let borderColor = 'transparent'
  let borderWidth = 0

  if (active) {
    bg = '#14b8a6'
  } else if (today) {
    bg = isDark ? '#1c2e2e' : '#f0fdfa'
    borderColor = '#14b8a6'
    borderWidth = 2
  }

  return (
    <View style={{ alignItems: 'center', gap: 5 }}>
      <Animated.View style={[animStyle, {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: bg, borderWidth, borderColor,
        alignItems: 'center', justifyContent: 'center',
        ...(active && {
          shadowColor: '#14b8a6',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 3,
        }),
      }]}>
        {active && (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '900' }}>✓</Text>
        )}
        {today && !active && (
          <Text style={{ color: '#14b8a6', fontSize: 11, fontWeight: '700' }}>hoje</Text>
        )}
      </Animated.View>
      <Text style={{
        fontSize: 10, fontWeight: '600',
        color: active ? '#14b8a6' : (isDark ? '#8b8b98' : '#71717a'),
      }}>
        {label}
      </Text>
    </View>
  )
}

interface WeeklyActivityProps {
  streak: StreakData
}

export function WeeklyActivity({ streak }: WeeklyActivityProps) {
  const isDark = useColorScheme() === 'dark'
  const todayIndex = new Date().getDay() // 0 = Sun

  return (
    <View style={{
      backgroundColor: isDark ? '#24242c' : '#ffffff',
      borderRadius: 20, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#2a2a32' : '#e4e4e7',
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: isDark ? '#d4d4d8' : '#3f3f46' }}>
          Esta semana
        </Text>
        <StreakBadge streak={streak.currentStreak} />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {streak.weekActivity.map((active, i) => (
          <DayCircle
            key={i}
            active={active}
            today={i === todayIndex}
            label={DAY_LABELS[i]}
            index={i}
          />
        ))}
      </View>
    </View>
  )
}
