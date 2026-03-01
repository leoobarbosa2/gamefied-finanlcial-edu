import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { PlayCircle, Clock } from 'lucide-react-native'
import type { ContinueLesson } from '../../types'

interface ContinueCardProps {
  lesson: ContinueLesson
}

export function ContinueCard({ lesson }: ContinueCardProps) {
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/lessons/${lesson.lessonId}`)}
      activeOpacity={0.8}
      className="bg-accent-500 rounded-2xl p-4"
    >
      <Text className="text-xs font-medium text-accent-100 mb-1 uppercase tracking-wide">
        Continuar
      </Text>
      <Text className="text-base font-bold text-white mb-1" numberOfLines={2}>
        {lesson.lessonTitle}
      </Text>
      <Text className="text-xs text-accent-100 mb-3">{lesson.pathTitle}</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Clock size={12} color="rgba(255,255,255,0.8)" />
          <Text className="text-xs text-white/80">{lesson.estimatedMins} min</Text>
        </View>
        <View className="flex-row items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
          <PlayCircle size={14} color="white" />
          <Text className="text-xs font-semibold text-white">Continuar</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
