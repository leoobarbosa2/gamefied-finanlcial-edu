import React from 'react'
import { View, useColorScheme } from 'react-native'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
  accentColor?: string
}

export function Card({ children, className, elevated = false, accentColor }: CardProps) {
  const isDark = useColorScheme() === 'dark'

  return (
    <View
      style={[
        elevated && !isDark && {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 6,
        },
        accentColor && {
          borderLeftWidth: 4,
          borderLeftColor: accentColor,
        },
      ]}
      className={cn(
        'bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4',
        className
      )}
    >
      {children}
    </View>
  )
}
