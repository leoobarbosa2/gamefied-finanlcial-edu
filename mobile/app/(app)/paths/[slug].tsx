import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, RefreshControl, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react-native'
import * as LucideIcons from 'lucide-react-native'
import { pathsApi } from '../../../src/api/paths'
import { lessonsApi } from '../../../src/api/lessons'
import { useAuthStore } from '../../../src/store/authStore'
import { LessonCard } from '../../../src/components/dashboard/LessonCard'
import { Skeleton } from '../../../src/components/ui/Skeleton'
import { DailyLimitModal } from '../../../src/components/lesson/DailyLimitModal'
import { pathColors } from '../../../src/constants/colors'
import type { DailyLimitStatus, LessonSummary } from '../../../src/types'

function toPascalCase(str: string) {
  return str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

export default function PathDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const [limitStatus, setLimitStatus] = useState<DailyLimitStatus | null>(null)
  const [limitModalVisible, setLimitModalVisible] = useState(false)

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['path', slug],
    queryFn: () => pathsApi.getOne(slug!),
    enabled: !!slug,
  })

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true)
    await refetch()
    setIsManualRefreshing(false)
  }

  const handleLessonPress = async (lesson: LessonSummary) => {
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

  const colorSet = pathColors[data?.colorToken ?? 'teal'] ?? pathColors.teal
  const iconColor = isDark ? colorSet.darkText : colorSet.text
  const iconBg = isDark ? colorSet.darkBg : colorSet.bg

  const PathIcon = data
    ? ((LucideIcons as Record<string, any>)[toPascalCase(data.iconName)] ?? LucideIcons.BookOpen)
    : LucideIcons.BookOpen

  const c = {
    bg: isDark ? '#1c1c22' : '#f9fafb',
    surface: isDark ? '#24242c' : '#ffffff',
    border: isDark ? '#2a2a32' : '#e4e4e7',
    textPrimary: isDark ? '#f4f4f5' : '#09090b',
    textMuted: isDark ? '#8b8b98' : '#71717a',
    sectionLabel: isDark ? '#8b8b98' : '#71717a',
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={handleManualRefresh} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back link */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
          }}
        >
          <ArrowLeft size={16} color={c.textMuted} />
          <Text style={{ fontSize: 13, color: c.textMuted, fontWeight: '500' }}>
            Todas as trilhas
          </Text>
        </TouchableOpacity>

        {/* Path header */}
        {isLoading ? (
          <View style={{ paddingHorizontal: 16, gap: 12, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <Skeleton className="h-7 w-40 rounded-lg" />
            </View>
            <Skeleton className="h-14 rounded-lg" />
            <Skeleton className="h-3 rounded-full" />
          </View>
        ) : data ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            {/* Icon + title row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: iconBg,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <PathIcon size={28} color={iconColor} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: c.textPrimary, flex: 1 }}>
                {data.title}
              </Text>
            </View>

            {/* Description */}
            <Text style={{ fontSize: 14, color: c.textMuted, lineHeight: 22, marginBottom: 16 }}>
              {data.description}
            </Text>

            {/* Progress bar */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{
                flex: 1, height: 8, borderRadius: 4,
                backgroundColor: isDark ? '#2a2a32' : '#e4e4e7',
                overflow: 'hidden',
              }}>
                <View style={{
                  width: `${completionPct}%`, height: '100%',
                  borderRadius: 4, backgroundColor: '#14b8a6',
                }} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: c.textPrimary, minWidth: 32, textAlign: 'right' }}>
                {completedCount}/{totalCount}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Lessons section */}
        {isLoading ? (
          <View style={{ paddingHorizontal: 16, gap: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </View>
        ) : data?.lessons && data.lessons.length > 0 ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              fontSize: 11, fontWeight: '700', color: c.sectionLabel,
              letterSpacing: 0.8, textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Lições
            </Text>
            <View style={{
              backgroundColor: c.surface,
              borderRadius: 16,
              borderWidth: 1, borderColor: c.border,
              overflow: 'hidden',
            }}>
              {data.lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isFirst={index === 0}
                  isLast={index === data.lessons.length - 1}
                  onPress={() => handleLessonPress(lesson)}
                />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {limitStatus && (
        <DailyLimitModal
          visible={limitModalVisible}
          onClose={() => setLimitModalVisible(false)}
          status={limitStatus}
          onSessionsBought={() => setLimitStatus(null)}
        />
      )}
    </SafeAreaView>
  )
}
