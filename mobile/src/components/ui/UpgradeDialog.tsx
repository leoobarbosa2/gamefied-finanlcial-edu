import React from 'react'
import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native'
import { Lock, X } from 'lucide-react-native'
import { Button } from './Button'

interface UpgradeDialogProps {
  visible: boolean
  onClose: () => void
}

export function UpgradeDialog({ visible, onClose }: UpgradeDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-6"
        onPress={onClose}
      >
        <Pressable
          className="bg-white dark:bg-[#24242c] rounded-2xl p-6 w-full max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 p-1"
          >
            <X size={20} color="#71717a" />
          </TouchableOpacity>

          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 items-center justify-center mb-3">
              <Lock size={28} color="#d97706" />
            </View>
            <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5] text-center">
              Conteúdo PRO
            </Text>
          </View>

          <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] text-center mb-6">
            Esta trilha é exclusiva para assinantes PRO. Faça upgrade para acessar conteúdo ilimitado.
          </Text>

          <Button variant="primary" fullWidth onPress={onClose}>
            Entendido
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
