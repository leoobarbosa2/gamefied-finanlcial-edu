import React, { useState } from 'react'
import { ScrollView, View, Text, RefreshControl, TouchableOpacity, Appearance, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Moon, Sun } from 'lucide-react-native'
import { dashboardApi } from '../../src/api/dashboard'
import { lessonsApi } from '../../src/api/lessons'
import { useAuthStore } from '../../src/store/authStore'
import { XPBar } from '../../src/components/ui/XPBar'
import { Skeleton } from '../../src/components/ui/Skeleton'
import { WeeklyActivity } from '../../src/components/dashboard/WeeklyActivity'
import { ContinueCard } from '../../src/components/dashboard/ContinueCard'
import { PathCard } from '../../src/components/dashboard/PathCard'

export default function Dashboard() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 30_000,
  })

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true)
    await refetch()
    setIsManualRefreshing(false)
  }

  const { data: limitData } = useQuery({
    queryKey: ['dailyLimit'],
    queryFn: lessonsApi.getDailyLimit,
    staleTime: 30_000,
  })

  const firstName = user?.displayName?.split(' ')[0] ?? ''
  const initial = user?.displayName?.charAt(0).toUpperCase() ?? '?'
  const coins = data?.gamification?.coins ?? user?.coins ?? 0
  const sessionsUsed = limitData?.used ?? 0
  const sessionsLimit = limitData?.limit ?? 3
  const isPro = limitData?.isPro ?? user?.plan === 'PRO'

  const c = {
    bg: isDark ? '#1c1c22' : '#f9fafb',
    surface: isDark ? '#24242c' : '#ffffff',
    border: isDark ? '#2a2a32' : '#e4e4e7',
    textPrimary: isDark ? '#f4f4f5' : '#09090b',
    textMuted: isDark ? '#8b8b98' : '#71717a',
    dotEmpty: isDark ? '#3d3d4a' : '#e4e4e7',
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      {/* Top nav */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: c.surface,
        borderBottomWidth: 1, borderBottomColor: c.border,
      }}>
        <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', color: c.textPrimary }}>
          Finlearn
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 12 }}>
          <Text style={{ fontSize: 15 }}>🪙</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#f59e0b' }}>{coins}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Appearance.setColorScheme(isDark ? 'light' : 'dark')}
          style={{ marginRight: 12, padding: 4 }}
        >
          {isDark ? <Sun size={20} color="#8b8b98" /> : <Moon size={20} color="#71717a" />}
        </TouchableOpacity>
        <View style={{
          width: 34, height: 34, borderRadius: 17,
          backgroundColor: '#14b8a6',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{initial}</Text>
        </View>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={handleManualRefresh} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats card */}
        {isLoading ? (
          <Skeleton className="h-40 rounded-2xl mb-5" />
        ) : (
          <View style={{
            backgroundColor: c.surface,
            borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: c.border,
            marginBottom: 20,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: c.textPrimary, flex: 1 }}>
                Olá, {firstName}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 8 }}>
                <Text style={{ fontSize: 14 }}>🪙</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#f59e0b' }}>{coins}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 13, color: c.textMuted, marginBottom: 14 }}>
              Pronto para a próxima lição?
            </Text>

            {/* Streak + sessions */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 15 }}>🔥</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: c.textPrimary }}>
                  {data?.streak?.currentStreak ?? 0} {data?.streak?.currentStreak === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
              {!isPro && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {Array.from({ length: sessionsLimit }).map((_, i) => (
                    <View key={i} style={{
                      width: 8, height: 8, borderRadius: 4,
                      backgroundColor: i < sessionsUsed ? '#14b8a6' : c.dotEmpty,
                    }} />
                  ))}
                  <Text style={{ fontSize: 12, color: c.textMuted }}>
                    {sessionsUsed}/{sessionsLimit} sessões
                  </Text>
                </View>
              )}
            </View>

            {user && <XPBar xp={user.xp} level={user.level} />}
          </View>
        )}

        {/* Esta semana */}
        {isLoading && <Skeleton className="h-24 rounded-2xl mb-5" />}
        {!isLoading && data?.streak && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: c.textMuted, letterSpacing: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>
              Esta semana
            </Text>
            <WeeklyActivity streak={data.streak} />
          </View>
        )}

        {/* Continue */}
        {data?.continueLesson && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: c.textMuted, letterSpacing: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>
              Continue de onde parou
            </Text>
            <ContinueCard lesson={data.continueLesson} />
          </View>
        )}

        {/* Suas trilhas */}
        {isLoading && (
          <View style={{ gap: 12 }}>
            <Skeleton className="h-5 w-24 rounded mb-2" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </View>
        )}
        {(data?.recommendedPaths?.length ?? 0) > 0 && (
          <View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: c.textMuted, letterSpacing: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>
              Suas trilhas
            </Text>
            <View style={{ gap: 12 }}>
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
      </ScrollView>
    </SafeAreaView>
  )
}
