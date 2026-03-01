import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable, Alert } from 'react-native'
import { X, Clock, Coins, Bell } from 'lucide-react-native'
import * as Notifications from 'expo-notifications'
import { Button } from '../ui/Button'
import { lessonsApi } from '../../api/lessons'
import { useAuthStore } from '../../store/authStore'
import type { DailyLimitStatus } from '../../types'

interface DailyLimitModalProps {
  visible: boolean
  onClose: () => void
  status: DailyLimitStatus
  onSessionsBought: () => void
}

export function DailyLimitModal({
  visible,
  onClose,
  status,
  onSessionsBought,
}: DailyLimitModalProps) {
  const updateUser = useAuthStore((s) => s.updateUser)
  const user = useAuthStore((s) => s.user)
  const [buying, setBuying] = useState(false)

  const resetTime = new Date(status.resetAt)
  const hours = resetTime.getHours().toString().padStart(2, '0')
  const minutes = resetTime.getMinutes().toString().padStart(2, '0')

  const canAfford = (user?.coins ?? 0) >= 100

  const handleBuy = async () => {
    setBuying(true)
    try {
      const result = await lessonsApi.buySessions()
      updateUser({ coins: result.newCoins })
      onSessionsBought()
      onClose()
    } catch {
      Alert.alert('Erro', 'Não foi possível comprar sessões.')
    } finally {
      setBuying(false)
    }
  }

  const handleNotify = async () => {
    try {
      const { status: permStatus } = await Notifications.requestPermissionsAsync()
      if (permStatus === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Finlearn — Sessões renovadas!',
            body: 'Suas sessões diárias foram renovadas. Continue aprendendo!',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: resetTime },
        })
        Alert.alert('Pronto!', `Você será notificado às ${hours}:${minutes}.`)
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível agendar notificação.')
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-end bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="bg-white dark:bg-[#24242c] rounded-t-3xl p-6 w-full"
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-1"
          >
            <X size={20} color="#71717a" />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5] mb-1">
            Limite diário atingido
          </Text>
          <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mb-5">
            Você usou {status.used} de {status.limit} sessões de hoje.
          </Text>

          {/* Reset info */}
          <View className="flex-row items-center gap-2 bg-[#f3f4f6] dark:bg-[#2e2e38] rounded-xl px-4 py-3 mb-5">
            <Clock size={16} color="#71717a" />
            <Text className="text-sm text-[#3f3f46] dark:text-[#d4d4d8]">
              Reinicia às <Text className="font-semibold">{hours}:{minutes}</Text>
            </Text>
          </View>

          {/* Buy sessions */}
          <View className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4 mb-4 border border-amber-200 dark:border-amber-900">
            <View className="flex-row items-center gap-2 mb-2">
              <Coins size={18} color="#d97706" />
              <Text className="font-semibold text-amber-700 dark:text-amber-300">
                Comprar +3 sessões
              </Text>
            </View>
            <Text className="text-sm text-amber-600 dark:text-amber-400 mb-3">
              Custo: <Text className="font-bold">100 moedas</Text>
              {' '}• Você tem <Text className="font-bold">{user?.coins ?? 0} moedas</Text>
            </Text>
            <Button
              variant="primary"
              fullWidth
              loading={buying}
              disabled={!canAfford}
              onPress={handleBuy}
              className="bg-amber-500"
            >
              {canAfford ? 'Comprar sessões' : 'Moedas insuficientes'}
            </Button>
          </View>

          {/* Notification reminder */}
          <TouchableOpacity
            onPress={handleNotify}
            className="flex-row items-center justify-center gap-2 py-2"
          >
            <Bell size={14} color="#71717a" />
            <Text className="text-sm text-[#71717a] dark:text-[#8b8b98]">
              Me avisar quando renovar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
