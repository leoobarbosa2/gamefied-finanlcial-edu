import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock } from 'lucide-react-native'
import { pathsApi } from '../../../src/api/paths'
import { lessonsApi } from '../../../src/api/lessons'
import { useAuthStore } from '../../../src/store/authStore'
import { LessonCard } from '../../../src/components/dashboard/LessonCard'
import { ProgressBar } from '../../../src/components/progress/ProgressBar'
import { Skeleton } from '../../../src/components/ui/Skeleton'
import { DailyLimitModal } from '../../../src/components/lesson/DailyLimitModal'
import type { DailyLimitStatus, LessonSummary } from '../../../src/types'

export default function PathDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [limitStatus, setLimitStatus] = useState<DailyLimitStatus | null>(null)
  const [limitModalVisible, setLimitModalVisible] = useState(false)

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['path', slug],
    queryFn: () => pathsApi.getOne(slug!),
    enabled: !!slug,
  })

  const handleLessonPress = async (lesson: LessonSummary) => {
    // Check daily limit before navigating
    try {
      const status = await lessonsApi.getDailyLimit()
      if (!status.canLearn) {
        setLimitStatus(status)
        setLimitModalVisible(true)
        return
      }
    } catch {
      // If check fails, let the lesson screen handle it
    }
    router.push(`/(app)/lessons/${lesson.id}`)
  }

  const completedCount = data?.lessons.filter((l) => l.status === 'COMPLETED').length ?? 0
  const totalCount = data?.lessons.length ?? 0
  const completionPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb] dark:bg-[#1c1c22]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-2 pb-3 bg-white dark:bg-[#1c1c22] border-b border-[#e4e4e7] dark:border-[#2a2a32]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft size={22} color="#71717a" />
        </TouchableOpacity>
        <View className="flex-1">
          {isLoading ? (
            <Skeleton className="h-6 w-40 rounded" />
          ) : (
            <Text className="text-lg font-bold text-[#09090b] dark:text-[#f4f4f5]" numberOfLines={1}>
              {data?.title}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Description + progress */}
        {data && (
          <View className="bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4 mb-5">
            <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mb-3">
              {data.description}
            </Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">
                {completedCount}/{totalCount} lições
              </Text>
              <Text className="text-xs font-semibold text-accent-500">
                {Math.round(completionPct)}%
              </Text>
            </View>
            <ProgressBar value={completionPct} />
          </View>
        )}

        {/* Lessons list */}
        {isLoading ? (
          <View className="gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </View>
        ) : (
          <View>
            {data?.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isFirst={index === 0}
                isLast={index === data.lessons.length - 1}
                onPress={() => handleLessonPress(lesson)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {limitStatus && (
        <DailyLimitModal
          visible={limitModalVisible}
          onClose={() => setLimitModalVisible(false)}
          status={limitStatus}
          onSessionsBought={() => {
            setLimitStatus(null)
          }}
        />
      )}
    </SafeAreaView>
  )
}
