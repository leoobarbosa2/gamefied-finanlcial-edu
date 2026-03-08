import React, { useState, useEffect } from 'react'
import { ScrollView, View, Text, RefreshControl, Pressable, Appearance, useColorScheme } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Moon, Sun, Zap, Trophy, Flame } from 'lucide-react-native'
import { dashboardApi } from '../../src/api/dashboard'
import { lessonsApi } from '../../src/api/lessons'
import { useAuthStore } from '../../src/store/authStore'
import { XPBar } from '../../src/components/ui/XPBar'
import { LevelBadge } from '../../src/components/ui/LevelBadge'
import { Skeleton } from '../../src/components/ui/Skeleton'
import { WeeklyActivity } from '../../src/components/dashboard/WeeklyActivity'
import { ContinueCard } from '../../src/components/dashboard/ContinueCard'
import { PathCard } from '../../src/components/dashboard/PathCard'

// Animated stat mini-card
function StatCard({
  icon, value, label, color, delay,
}: {
  icon: React.ReactNode
  value: number | string
  label: string
  color: string
  delay: number
}) {
  const isDark = useColorScheme() === 'dark'
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(24)

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }))
    translateY.value = withDelay(delay, withSpring(0, { damping: 18, stiffness: 180 }))
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[animStyle, {
      flex: 1,
      backgroundColor: isDark ? '#24242c' : '#ffffff',
      borderRadius: 18, padding: 14,
      borderWidth: 1, borderColor: isDark ? '#2a2a32' : '#e4e4e7',
      alignItems: 'center', gap: 4,
      shadowColor: color,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: isDark ? 0 : 0.15,
      shadowRadius: 6,
      elevation: isDark ? 0 : 3,
    }]}>
      <View style={{
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : `${color}18`,
        alignItems: 'center', justifyContent: 'center', marginBottom: 2,
      }}>
        {icon}
      </View>
      <Text style={{ fontSize: 20, fontWeight: '900', color, letterSpacing: -0.5 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 11, fontWeight: '600', color: isDark ? '#8b8b98' : '#71717a' }}>
        {label}
      </Text>
    </Animated.View>
  )
}

export default function Dashboard() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isDark = useColorScheme() === 'dark'

  // Screen entrance animation
  const screenOpacity = useSharedValue(0)
  const screenY = useSharedValue(20)

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.quad) })
    screenY.value = withSpring(0, { damping: 22, stiffness: 160 })
  }, [])

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenY.value }],
  }))

  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    staleTime: 30_000,
  })

  const { data: limitData } = useQuery({
    queryKey: ['dailyLimit'],
    queryFn: lessonsApi.getDailyLimit,
    staleTime: 30_000,
  })

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true)
    await refetch()
    setIsManualRefreshing(false)
  }

  const firstName = user?.displayName?.split(' ')[0] ?? ''
  const initial = user?.displayName?.charAt(0).toUpperCase() ?? '?'
  const coins = data?.gamification?.coins ?? user?.coins ?? 0
  const sessionsUsed = limitData?.used ?? 0
  const sessionsLimit = limitData?.limit ?? 3
  const isPro = limitData?.isPro ?? user?.plan === 'PRO'
  const streak = data?.streak?.currentStreak ?? 0

  const bg = isDark ? '#1c1c22' : '#f4f4f5'
  const surface = isDark ? '#24242c' : '#ffffff'
  const border = isDark ? '#2a2a32' : '#e4e4e7'
  const textPrimary = isDark ? '#f4f4f5' : '#09090b'
  const textMuted = isDark ? '#8b8b98' : '#71717a'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      {/* ── HEADER (gradient) ── */}
      <LinearGradient
        colors={isDark ? ['#0a1f1e', '#0d3330'] : ['#0d9488', '#14b8a6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 16, paddingVertical: 14, gap: 10,
        }}
      >
        <Text style={{ flex: 1, fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>
          Finlearn
        </Text>

        {/* Coins badge (white pill) */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.3)',
          paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
        }}>
          <Text style={{ fontSize: 14 }}>🪙</Text>
          <Text style={{ fontSize: 13, fontWeight: '800', color: '#fbbf24' }}>{coins}</Text>
        </View>

        {/* Theme toggle */}
        <Pressable
          onPress={() => Appearance.setColorScheme(isDark ? 'light' : 'dark')}
          style={{ padding: 6 }}
        >
          {isDark
            ? <Sun size={18} color="rgba(255,255,255,0.7)" />
            : <Moon size={18} color="rgba(255,255,255,0.7)" />
          }
        </Pressable>

        {/* Avatar with level badge */}
        <View style={{ position: 'relative' }}>
          <View style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: 'rgba(255,255,255,0.25)',
            borderWidth: 2.5, borderColor: '#f59e0b',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '900' }}>{initial}</Text>
          </View>
          {user && (
            <View style={{ position: 'absolute', bottom: -6, right: -6 }}>
              <LevelBadge level={user.level} size={22} />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ── CONTENT ── */}
      <Animated.ScrollView
        style={screenStyle}
        refreshControl={<RefreshControl refreshing={isManualRefreshing} onRefresh={handleManualRefresh} tintColor="#14b8a6" />}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HERO CARD ── */}
        {isLoading ? (
          <Skeleton className="h-44 rounded-3xl mb-4" />
        ) : (
          <View style={{
            backgroundColor: surface, borderRadius: 24,
            borderWidth: 1, borderColor: border,
            padding: 20, marginBottom: 16,
            shadowColor: '#14b8a6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0 : 0.1,
            shadowRadius: 12, elevation: isDark ? 0 : 5,
          }}>
            {/* Greeting row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: textPrimary, letterSpacing: -0.5 }}>
                Olá, {firstName}! 👋
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: textMuted, marginBottom: 18 }}>
              {streak > 0
                ? `🔥 ${streak} ${streak === 1 ? 'dia' : 'dias'} de sequência — continue assim!`
                : 'Pronto para começar hoje?'}
            </Text>

            {/* XP bar */}
            {user && <XPBar xp={user.xp} level={user.level} />}

            {/* Sessions row */}
            {!isPro && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <Text style={{ fontSize: 12, color: textMuted, fontWeight: '600' }}>Energia:</Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                  {Array.from({ length: sessionsLimit }).map((_, i) => (
                    <Text key={i} style={{ fontSize: 18 }}>
                      {i < sessionsUsed ? '⚡' : '🔘'}
                    </Text>
                  ))}
                </View>
                <Text style={{ fontSize: 12, color: textMuted }}>
                  {sessionsUsed}/{sessionsLimit} hoje
                </Text>
              </View>
            )}
            {isPro && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
                <Trophy size={14} color="#f59e0b" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#f59e0b' }}>PRO — sessões ilimitadas</Text>
              </View>
            )}
          </View>
        )}

        {/* ── STATS ROW ── */}
        {isLoading ? (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <Skeleton className="flex-1 h-24 rounded-2xl" />
            <Skeleton className="flex-1 h-24 rounded-2xl" />
            <Skeleton className="flex-1 h-24 rounded-2xl" />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <StatCard
              icon={<Zap size={20} color="#14b8a6" fill="#14b8a6" />}
              value={user?.xp ?? 0}
              label="XP Total"
              color="#14b8a6"
              delay={0}
            />
            <StatCard
              icon={<Text style={{ fontSize: 20 }}>🪙</Text>}
              value={coins}
              label="Moedas"
              color="#f59e0b"
              delay={80}
            />
            <StatCard
              icon={<Flame size={20} color="#f97316" fill="#f97316" />}
              value={streak}
              label="Dias"
              color="#f97316"
              delay={160}
            />
          </View>
        )}

        {/* ── WEEKLY ACTIVITY ── */}
        {isLoading && <Skeleton className="h-28 rounded-2xl mb-4" />}
        {!isLoading && data?.streak && (
          <View style={{ marginBottom: 20 }}>
            <WeeklyActivity streak={data.streak} />
          </View>
        )}

        {/* ── CONTINUE CARD ── */}
        {data?.continueLesson && (
          <View style={{ marginBottom: 20 }}>
            <ContinueCard lesson={data.continueLesson} />
          </View>
        )}

        {/* ── PATHS ── */}
        {isLoading && (
          <View style={{ gap: 12 }}>
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </View>
        )}
        {(data?.recommendedPaths?.length ?? 0) > 0 && (
          <View>
            <Text style={{
              fontSize: 12, fontWeight: '800', color: textMuted,
              letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase',
            }}>
              Suas Trilhas
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
      </Animated.ScrollView>
    </SafeAreaView>
  )
}
