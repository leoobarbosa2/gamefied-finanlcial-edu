import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useColorScheme } from 'react-native'
import { Lock } from 'lucide-react-native'
import * as LucideIcons from 'lucide-react-native'
import { CompletionRing } from '../progress/CompletionRing'
import { pathColors } from '../../constants/colors'
import type { LearningPath } from '../../types'

interface PathCardProps {
  path: LearningPath
  onPress: () => void
}

function toPascalCase(str: string) {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function DynamicIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const pascal = toPascalCase(name)
  const Icon = (LucideIcons as Record<string, any>)[pascal] ?? LucideIcons.BookOpen
  return <Icon size={size} color={color} />
}

export function PathCard({ path, onPress }: PathCardProps) {
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'
  const colorSet = pathColors[path.colorToken] ?? pathColors.teal

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4 flex-row items-center gap-3"
    >
      {/* Icon */}
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: isDark ? colorSet.darkBg : colorSet.bg }}
      >
        {path.isPremium ? (
          <Lock size={20} color={isDark ? colorSet.darkText : colorSet.text} />
        ) : (
          <DynamicIcon
            name={path.iconName}
            color={isDark ? colorSet.darkText : colorSet.text}
            size={20}
          />
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text className="text-base font-semibold text-[#09090b] dark:text-[#f4f4f5]" numberOfLines={1}>
            {path.title}
          </Text>
          {path.isPremium && (
            <View className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded">
              <Text className="text-xs font-bold text-amber-600 dark:text-amber-300">PRO</Text>
            </View>
          )}
        </View>
        <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">
          {path.completedLessons}/{path.totalLessons} lições
        </Text>
      </View>

      {/* Ring */}
      <CompletionRing
        pct={path.completionPct}
        size={40}
        stroke={3}
        color={isDark ? colorSet.darkText : colorSet.text}
        trackColor={isDark ? '#2a2a32' : '#e4e4e7'}
      />
    </TouchableOpacity>
  )
}
