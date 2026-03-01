import React from 'react'
import { View } from 'react-native'
import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <View
      className={cn(
        'bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4',
        className
      )}
    >
      {children}
    </View>
  )
}
