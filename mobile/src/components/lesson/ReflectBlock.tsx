import React, { useState } from 'react'
import { ScrollView, View, Text, TextInput } from 'react-native'
import { PenLine } from 'lucide-react-native'
import type { ReflectContent } from '../../types'

interface ReflectBlockProps {
  content: ReflectContent
}

export function ReflectBlock({ content }: ReflectBlockProps) {
  const [text, setText] = useState('')

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center gap-2 mb-4">
        <PenLine size={18} color="#0d9488" />
        <Text className="text-xs font-semibold text-accent-500 uppercase tracking-widest">
          Reflexão
        </Text>
      </View>

      <Text className="text-xl font-bold text-[#09090b] dark:text-[#f4f4f5] leading-snug mb-4">
        {content.prompt}
      </Text>

      {content.hint && (
        <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mb-4 italic">
          {content.hint}
        </Text>
      )}

      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={6}
        placeholder="Escreva seus pensamentos aqui... (opcional)"
        placeholderTextColor="#71717a"
        className="border border-[#e4e4e7] dark:border-[#2a2a32] rounded-2xl px-4 py-3 text-base text-[#09090b] dark:text-[#f4f4f5] bg-white dark:bg-[#24242c]"
        style={{ textAlignVertical: 'top', minHeight: 140 }}
      />
    </ScrollView>
  )
}
