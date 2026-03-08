import React from 'react'
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import { Check, Clock } from 'lucide-react-native'
import type { LessonSummary } from '../../types'

interface LessonCardProps {
  lesson: LessonSummary
  isFirst: boolean
  isLast: boolean
  onPress: () => void
}

export function LessonCard({ lesson, isFirst, isLast, onPress }: LessonCardProps) {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const isCompleted = lesson.status === 'COMPLETED'
  const isInProgress = lesson.status === 'IN_PROGRESS'

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingVertical: 14, paddingHorizontal: 16,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: isDark ? '#2a2a32' : '#f3f4f6',
      }}
    >
      {/* Status circle */}
      <View style={{
        width: 32, height: 32, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: isCompleted
          ? '#14b8a6'
          : isInProgress
          ? 'transparent'
          : (isDark ? '#2e2e38' : '#f3f4f6'),
        borderWidth: isInProgress ? 2 : 0,
        borderColor: '#14b8a6',
        flexShrink: 0,
      }}>
        {isCompleted ? (
          <Check size={14} color="#fff" strokeWidth={3} />
        ) : isInProgress ? (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#14b8a6' }} />
        ) : (
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDark ? '#3d3d4a' : '#d4d4d8' }} />
        )}
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14, fontWeight: '600', marginBottom: 2,
            color: isCompleted || isInProgress
              ? (isDark ? '#f4f4f5' : '#09090b')
              : (isDark ? '#8b8b98' : '#71717a'),
          }}
          numberOfLines={1}
        >
          {lesson.title}
        </Text>
        {lesson.description && (
          <Text
            style={{ fontSize: 12, color: isDark ? '#8b8b98' : '#71717a' }}
            numberOfLines={1}
          >
            {lesson.description}
          </Text>
        )}
      </View>

      {/* Duration */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <Clock size={11} color={isDark ? '#8b8b98' : '#71717a'} />
        <Text style={{ fontSize: 11, color: isDark ? '#8b8b98' : '#71717a' }}>
          {lesson.estimatedMins}m
        </Text>
      </View>
    </TouchableOpacity>
  )
}
