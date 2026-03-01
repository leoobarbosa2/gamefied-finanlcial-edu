import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Check, Clock } from 'lucide-react-native'
import type { LessonSummary } from '../../types'

interface LessonCardProps {
  lesson: LessonSummary
  isFirst: boolean
  isLast: boolean
  onPress: () => void
}

export function LessonCard({ lesson, isFirst, isLast, onPress }: LessonCardProps) {
  const isCompleted = lesson.status === 'COMPLETED'
  const isInProgress = lesson.status === 'IN_PROGRESS'
  const isNotStarted = lesson.status === 'NOT_STARTED'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row gap-4 items-start"
    >
      {/* Timeline */}
      <View className="items-center" style={{ width: 32 }}>
        {!isFirst && (
          <View className="w-0.5 h-4 bg-[#e4e4e7] dark:bg-[#2a2a32] -mb-1" />
        )}
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isCompleted
              ? 'bg-accent-500'
              : isInProgress
              ? 'bg-accent-100 dark:bg-accent-900 border-2 border-accent-500'
              : 'bg-[#f3f4f6] dark:bg-[#2e2e38] border border-[#e4e4e7] dark:border-[#2a2a32]'
          }`}
        >
          {isCompleted ? (
            <Check size={14} color="white" strokeWidth={3} />
          ) : (
            <View
              className={`w-2 h-2 rounded-full ${
                isInProgress ? 'bg-accent-500' : 'bg-[#d4d4d8] dark:bg-[#3d3d4a]'
              }`}
            />
          )}
        </View>
        {!isLast && (
          <View className="w-0.5 flex-1 bg-[#e4e4e7] dark:bg-[#2a2a32] mt-1 min-h-4" />
        )}
      </View>

      {/* Content */}
      <View className="flex-1 pb-4">
        <Text
          className={`text-base font-medium mb-0.5 ${
            isCompleted || isInProgress
              ? 'text-[#09090b] dark:text-[#f4f4f5]'
              : 'text-[#71717a] dark:text-[#8b8b98]'
          }`}
        >
          {lesson.title}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Clock size={11} color="#71717a" />
            <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">
              {lesson.estimatedMins} min
            </Text>
          </View>
          {isCompleted && lesson.score !== null && (
            <Text className="text-xs text-accent-600 dark:text-accent-400 font-medium">
              {lesson.score}%
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
