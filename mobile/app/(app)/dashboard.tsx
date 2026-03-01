import React from 'react'
import { ScrollView, View, Text, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../../src/api/dashboard'
import { useAuthStore } from '../../src/store/authStore'
import { XPBar } from '../../src/components/ui/XPBar'
import { CoinsBadge } from '../../src/components/ui/CoinsBadge'
import { LevelBadge } from '../../src/components/ui/LevelBadge'
import { ProBadge } from '../../src/components/ui/ProBadge'
import { Skeleton } from '../../src/components/ui/Skeleton'
import { WeeklyActivity } from '../../src/components/dashboard/WeeklyActivity'
import { ContinueCard } from '../../src/components/dashboard/ContinueCard'
import { PathCard } from '../../src/components/dashboard/PathCard'

export default function Dashboard() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 30_000,
  })

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb] dark:bg-[#1c1c22]" edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-3 bg-white dark:bg-[#1c1c22] border-b border-[#e4e4e7] dark:border-[#2a2a32]">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-xs text-[#71717a] dark:text-[#8b8b98] mb-0.5">
                {isLoading ? '...' : (data?.greeting ?? 'Olá')}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5]">
                  {user?.displayName ?? ''}
                </Text>
                {user?.plan === 'PRO' && <ProBadge />}
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              {data && <CoinsBadge coins={data.gamification.coins} />}
              {user && <LevelBadge level={user.level} />}
            </View>
          </View>

          {/* XP Bar */}
          {user && (
            <XPBar xp={user.xp} level={user.level} />
          )}
        </View>

        <View className="px-4 pt-4 gap-4">
          {/* Continue learning */}
          {isLoading && (
            <Skeleton className="h-28 rounded-2xl" />
          )}
          {data?.continueLesson && (
            <ContinueCard lesson={data.continueLesson} />
          )}

          {/* Weekly activity */}
          {isLoading ? (
            <Skeleton className="h-28 rounded-2xl" />
          ) : data?.streak ? (
            <WeeklyActivity streak={data.streak} />
          ) : null}

          {/* Recommended paths */}
          {(data?.recommendedPaths?.length ?? 0) > 0 && (
            <View>
              <Text className="text-sm font-semibold text-[#3f3f46] dark:text-[#d4d4d8] mb-3">
                Trilhas recomendadas
              </Text>
              <View className="gap-3">
                {data!.recommendedPaths.map((path) => (
                  <PathCard
                    key={path.id}
                    path={path}
                    onPress={() => router.push(`/(app)/paths/${path.slug}`)}
                  />
                ))}
              </View>
            </View>
          )}

          {isLoading && (
            <View className="gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
