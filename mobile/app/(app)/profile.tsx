import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Flame, LogOut, Edit2, X, Moon, Sun } from 'lucide-react-native'
import { useColorScheme } from 'react-native'
import { progressApi } from '../../src/api/progress'
import { userApi } from '../../src/api/user'
import { authApi } from '../../src/api/auth'
import { useAuthStore } from '../../src/store/authStore'
import { useThemeStore } from '../../src/store/themeStore'
import { XPBar } from '../../src/components/ui/XPBar'
import { CoinsBadge } from '../../src/components/ui/CoinsBadge'
import { ProBadge } from '../../src/components/ui/ProBadge'
import { Skeleton } from '../../src/components/ui/Skeleton'
import { Button } from '../../src/components/ui/Button'

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View className="flex-1 bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-3 items-center">
      <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5]">{value}</Text>
      <Text className="text-xs text-[#71717a] dark:text-[#8b8b98] text-center mt-0.5">{label}</Text>
    </View>
  )
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function Profile() {
  const router = useRouter()
  const scheme = useColorScheme()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const logout = useAuthStore((s) => s.logout)
  const { toggleTheme } = useThemeStore()

  const [editVisible, setEditVisible] = useState(false)
  const [newName, setNewName] = useState(user?.displayName ?? '')
  const [saving, setSaving] = useState(false)

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: progressApi.getMetrics,
    staleTime: 60_000,
  })

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const updated = await userApi.update({ displayName: newName.trim() })
      updateUser({ displayName: updated.displayName })
      setEditVisible(false)
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o nome.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await authApi.logout().catch(() => {})
          await logout()
          router.replace('/landing')
        },
      },
    ])
  }

  const initials = (user?.displayName ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb] dark:bg-[#1c1c22]" edges={['top']}>
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 bg-white dark:bg-[#1c1c22] border-b border-[#e4e4e7] dark:border-[#2a2a32]">
        <Text className="text-2xl font-bold text-[#09090b] dark:text-[#f4f4f5]">Perfil</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={toggleTheme} className="p-1">
            {scheme === 'dark' ? (
              <Sun size={20} color="#71717a" />
            ) : (
              <Moon size={20} color="#71717a" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} className="p-1">
            <LogOut size={20} color="#71717a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + name */}
        <View className="bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-5 mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-accent-500 items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-white">{initials}</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5]">
              {user?.displayName}
            </Text>
            <TouchableOpacity onPress={() => { setNewName(user?.displayName ?? ''); setEditVisible(true) }}>
              <Edit2 size={16} color="#71717a" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mb-3">{user?.email}</Text>

          <View className="flex-row items-center gap-3 mb-4">
            {user?.plan === 'PRO' && <ProBadge />}
            {user && <CoinsBadge coins={user.coins} />}
          </View>

          {user && (
            <View className="w-full">
              <XPBar xp={user.xp} level={user.level} />
            </View>
          )}
        </View>

        {/* Stats grid */}
        {isLoading ? (
          <View className="gap-3">
            <View className="flex-row gap-3">
              <Skeleton className="flex-1 h-20 rounded-2xl" />
              <Skeleton className="flex-1 h-20 rounded-2xl" />
              <Skeleton className="flex-1 h-20 rounded-2xl" />
            </View>
          </View>
        ) : metrics ? (
          <View className="gap-3 mb-4">
            <Text className="text-sm font-semibold text-[#3f3f46] dark:text-[#d4d4d8]">
              Estatísticas
            </Text>
            <View className="flex-row gap-3">
              <StatCard
                label="Sequência atual"
                value={`${user?.streak?.currentStreak ?? 0} 🔥`}
              />
              <StatCard
                label="Maior sequência"
                value={`${user?.streak?.longestStreak ?? 0} dias`}
              />
              <StatCard label="Lições" value={metrics.totalCompleted} />
            </View>
            <View className="flex-row gap-3">
              <StatCard label="Tempo total" value={formatTime(metrics.totalTimeSpentSecs)} />
              <StatCard
                label="Pontuação média"
                value={metrics.averageScore !== null ? `${Math.round(metrics.averageScore)}%` : '—'}
              />
              <StatCard label="Esta semana" value={metrics.weeklyCompleted} />
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Edit name modal */}
      <Modal
        visible={editVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 px-6"
          onPress={() => setEditVisible(false)}
        >
          <Pressable
            className="bg-white dark:bg-[#24242c] rounded-2xl p-6 w-full max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              onPress={() => setEditVisible(false)}
              className="absolute top-4 right-4 p-1"
            >
              <X size={20} color="#71717a" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-[#09090b] dark:text-[#f4f4f5] mb-4">
              Editar nome
            </Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              autoFocus
              className="border border-[#e4e4e7] dark:border-[#2a2a32] rounded-xl px-4 py-3 text-base text-[#09090b] dark:text-[#f4f4f5] bg-white dark:bg-[#2e2e38] mb-4"
              placeholderTextColor="#71717a"
            />

            <Button
              variant="primary"
              fullWidth
              loading={saving}
              disabled={!newName.trim()}
              onPress={handleSaveName}
            >
              Salvar
            </Button>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}
