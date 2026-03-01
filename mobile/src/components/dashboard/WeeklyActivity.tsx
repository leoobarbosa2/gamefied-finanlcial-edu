import React from 'react'
import { View, Text } from 'react-native'
import { Flame } from 'lucide-react-native'
import type { StreakData } from '../../types'

const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface WeeklyActivityProps {
  streak: StreakData
}

export function WeeklyActivity({ streak }: WeeklyActivityProps) {
  return (
    <View className="bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-[#09090b] dark:text-[#f4f4f5]">
          Atividade semanal
        </Text>
        <View className="flex-row items-center gap-1">
          <Flame size={14} color="#f97316" fill="#f97316" />
          <Text className="text-sm font-bold text-orange-500">
            {streak.currentStreak} dias
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {streak.weekActivity.map((active, i) => (
          <View key={i} className="items-center gap-1">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                active
                  ? 'bg-accent-500'
                  : 'bg-[#f3f4f6] dark:bg-[#2e2e38]'
              }`}
            >
              {active && <Text className="text-xs text-white font-bold">✓</Text>}
            </View>
            <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">{DAY_LABELS[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
