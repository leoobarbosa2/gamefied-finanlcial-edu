import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { Lightbulb } from 'lucide-react-native'
import type { ReadContent } from '../../types'

function parseBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} className="font-bold text-[#09090b] dark:text-[#f4f4f5]">
          {part.slice(2, -2)}
        </Text>
      )
    }
    return <Text key={i}>{part}</Text>
  })
}

interface ReadingBlockProps {
  content: ReadContent
}

export function ReadingBlock({ content }: ReadingBlockProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold text-[#09090b] dark:text-[#f4f4f5] mb-4 leading-tight">
        {content.heading}
      </Text>

      <Text className="text-base text-[#3f3f46] dark:text-[#d4d4d8] leading-relaxed mb-4">
        {parseBold(content.body)}
      </Text>

      {content.tip && (
        <View className="flex-row gap-3 bg-accent-50 dark:bg-accent-900/30 rounded-2xl p-4 border border-accent-200 dark:border-accent-800 mt-2">
          <View className="mt-0.5">
            <Lightbulb size={18} color="#0d9488" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-accent-700 dark:text-accent-300 mb-1">
              Dica
            </Text>
            <Text className="text-sm text-accent-700 dark:text-accent-300 leading-relaxed">
              {content.tip}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  )
}
