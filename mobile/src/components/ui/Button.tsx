import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  onPress?: () => void
  children: React.ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  className?: string
  textClassName?: string
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-accent-500 active:bg-accent-600',
  secondary: 'bg-transparent border border-accent-500',
  ghost:     'bg-transparent',
  danger:    'bg-red-500 active:bg-red-600',
}

const textVariantClasses: Record<Variant, string> = {
  primary:   'text-white',
  secondary: 'text-accent-500',
  ghost:     'text-accent-500',
  danger:    'text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 rounded-lg',
  md: 'px-5 py-3 rounded-xl',
  lg: 'px-6 py-4 rounded-2xl',
}

const textSizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  textClassName,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50',
        className
      )}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#14b8a6'}
        />
      ) : (
        <Text
          className={cn(
            'font-semibold text-center',
            textVariantClasses[variant],
            textSizeClasses[size],
            textClassName
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  )
}
