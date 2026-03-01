import React, { useState } from 'react'
import { FlatList, View, Text, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { pathsApi } from '../../../src/api/paths'
import { useAuthStore } from '../../../src/store/authStore'
import { PathCard } from '../../../src/components/dashboard/PathCard'
import { Skeleton } from '../../../src/components/ui/Skeleton'
import { UpgradeDialog } from '../../../src/components/ui/UpgradeDialog'
import type { LearningPath } from '../../../src/types'

export default function Paths() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [upgradeVisible, setUpgradeVisible] = useState(false)

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['paths'],
    queryFn: pathsApi.getAll,
    staleTime: 60_000,
  })

  const handlePathPress = (path: LearningPath) => {
    if (path.isPremium && user?.plan !== 'PRO') {
      setUpgradeVisible(true)
      return
    }
    router.push(`/(app)/paths/${path.slug}`)
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb] dark:bg-[#1c1c22]" edges={['top']}>
      <View className="px-4 pt-4 pb-3 bg-white dark:bg-[#1c1c22] border-b border-[#e4e4e7] dark:border-[#2a2a32]">
        <Text className="text-2xl font-bold text-[#09090b] dark:text-[#f4f4f5]">
          Trilhas
        </Text>
        <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mt-0.5">
          Escolha um tema e comece a aprender
        </Text>
      </View>

      {isLoading ? (
        <View className="px-4 pt-4 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PathCard path={item} onPress={() => handlePathPress(item)} />
          )}
          ListEmptyComponent={
            <Text className="text-center text-[#71717a] dark:text-[#8b8b98] mt-8">
              Nenhuma trilha disponível
            </Text>
          }
        />
      )}

      <UpgradeDialog
        visible={upgradeVisible}
        onClose={() => setUpgradeVisible(false)}
      />
    </SafeAreaView>
  )
}
