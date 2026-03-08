import React from 'react'
import { View, Text, useColorScheme } from 'react-native'
import { Flame } from 'lucide-react-native'
import type { StreakData } from '../../types'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface WeeklyActivityProps {
  streak: StreakData
}

export function WeeklyActivity({ streak }: WeeklyActivityProps) {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  return (
    <View style={{
      backgroundColor: isDark ? '#24242c' : '#ffffff',
      borderRadius: 16, padding: 16,
      borderWidth: 1, borderColor: isDark ? '#2a2a32' : '#e4e4e7',
      flexDirection: 'row', alignItems: 'center', gap: 8,
    }}>
      {/* Days grid */}
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        {streak.weekActivity.map((active, i) => (
          <View key={i} style={{ alignItems: 'center', gap: 4 }}>
            <View style={{
              width: 34, height: 34, borderRadius: 17,
              backgroundColor: active ? '#14b8a6' : (isDark ? '#2e2e38' : '#f3f4f6'),
              alignItems: 'center', justifyContent: 'center',
            }}>
              {active && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>✓</Text>}
            </View>
            <Text style={{ fontSize: 10, color: isDark ? '#8b8b98' : '#71717a' }}>
              {DAY_LABELS[i]}
            </Text>
          </View>
        ))}
      </View>

      {/* Streak count */}
      <View style={{ alignItems: 'center', gap: 2, paddingLeft: 8, borderLeftWidth: 1, borderLeftColor: isDark ? '#2a2a32' : '#e4e4e7' }}>
        <Flame size={22} color="#f97316" fill="#f97316" />
        <Text style={{ fontSize: 16, fontWeight: '800', color: isDark ? '#f4f4f5' : '#09090b' }}>
          {streak.currentStreak}
        </Text>
        <Text style={{ fontSize: 10, color: isDark ? '#8b8b98' : '#71717a', textAlign: 'center' }}>
          dias{'\n'}seguidos
        </Text>
      </View>
    </View>
  )
}
