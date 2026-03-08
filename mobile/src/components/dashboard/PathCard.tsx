import React from 'react'
import { View, Text, Pressable, useColorScheme } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Lock } from 'lucide-react-native'
import * as LucideIcons from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { CompletionRing } from '../progress/CompletionRing'
import { pathColors } from '../../constants/colors'
import type { LearningPath } from '../../types'

interface PathCardProps {
  path: LearningPath
  onPress: () => void
}

function toPascalCase(str: string) {
  return str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

function DynamicIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const pascal = toPascalCase(name)
  const Icon = (LucideIcons as Record<string, any>)[pascal] ?? LucideIcons.BookOpen
  return <Icon size={size} color={color} />
}

export function PathCard({ path, onPress }: PathCardProps) {
  const isDark = useColorScheme() === 'dark'
  const colorSet = pathColors[path.colorToken] ?? pathColors.teal
  const iconColor = isDark ? colorSet.darkText : colorSet.text
  const accentBg = isDark ? colorSet.darkBg : colorSet.bg

  const scale = useSharedValue(1)
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 400 })
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }) }}
    >
      <Animated.View style={[cardStyle, {
        backgroundColor: isDark ? '#24242c' : '#ffffff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDark ? '#2a2a32' : '#e4e4e7',
        // Left accent stripe
        borderLeftWidth: 5,
        borderLeftColor: iconColor,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        // Elevation
        shadowColor: iconColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0 : 0.12,
        shadowRadius: 6,
        elevation: isDark ? 0 : 3,
      }]}>
        {/* Icon circle */}
        <View style={{
          width: 48, height: 48, borderRadius: 14,
          backgroundColor: accentBg,
          alignItems: 'center', justifyContent: 'center',
        }}>
          {path.isPremium
            ? <Lock size={20} color={iconColor} />
            : <DynamicIcon name={path.iconName} color={iconColor} size={20} />
          }
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Text style={{
              fontSize: 15, fontWeight: '800', letterSpacing: -0.2,
              color: isDark ? '#f4f4f5' : '#09090b', flex: 1,
            }} numberOfLines={1}>
              {path.title}
            </Text>
            {path.isPremium && (
              <View style={{ backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#b45309' }}>PRO</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, color: isDark ? '#8b8b98' : '#71717a' }}>
            {path.completedLessons}/{path.totalLessons} lições concluídas
          </Text>

          {/* Mini progress bar */}
          <View style={{ height: 4, backgroundColor: isDark ? '#2a2a32' : '#e4e4e7', borderRadius: 999, marginTop: 8 }}>
            <View style={{
              height: '100%', width: `${path.completionPct}%`,
              backgroundColor: iconColor, borderRadius: 999,
            }} />
          </View>
        </View>

        {/* Ring */}
        <CompletionRing
          pct={path.completionPct}
          size={44}
          stroke={4}
          color={iconColor}
          trackColor={isDark ? '#2a2a32' : '#e4e4e7'}
        />
      </Animated.View>
    </Pressable>
  )
}
