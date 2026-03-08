import React from 'react'
import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface LevelBadgeProps {
  level: number
  size?: number
}

export function LevelBadge({ level, size = 36 }: LevelBadgeProps) {
  const fontSize = size <= 32 ? 11 : size <= 40 ? 13 : 15

  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      borderWidth: 2.5, borderColor: '#f59e0b',
      // Outer glow shadow
      shadowColor: '#f59e0b',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 4,
    }}>
      <LinearGradient
        colors={['#818cf8', '#6366f1', '#4f46e5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1, borderRadius: size / 2 - 1,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize, letterSpacing: -0.3 }}>
          {level}
        </Text>
      </LinearGradient>
    </View>
  )
}
