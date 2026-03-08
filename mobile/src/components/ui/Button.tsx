import React, { useCallback } from 'react'
import { Pressable, Text, ActivityIndicator, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
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

// Shadow color per variant (the "3D base" color)
const shadowColors: Record<Variant, string> = {
  primary:   '#0d9488',
  secondary: '#d4d4d8',
  ghost:     'transparent',
  danger:    '#dc2626',
}

const bgColors: Record<Variant, string> = {
  primary:   '#14b8a6',
  secondary: 'transparent',
  ghost:     'transparent',
  danger:    '#ef4444',
}

const sizeRadius: Record<Size, number> = {
  sm: 10,
  md: 14,
  lg: 18,
}

const sizePadding: Record<Size, { paddingHorizontal: number; paddingVertical: number }> = {
  sm: { paddingHorizontal: 12, paddingVertical: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 12 },
  lg: { paddingHorizontal: 24, paddingVertical: 16 },
}

const textSizeClasses: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const textVariantClasses: Record<Variant, string> = {
  primary:   'text-white',
  secondary: 'text-accent-500',
  ghost:     'text-accent-500',
  danger:    'text-white',
}

const SHADOW_HEIGHT = 4

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
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  const onPressIn = useCallback(() => {
    if (isDisabled) return
    translateY.value = withSpring(SHADOW_HEIGHT, { damping: 20, stiffness: 400 })
    opacity.value = withTiming(0.92, { duration: 80 })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [isDisabled])

  const onPressOut = useCallback(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 })
    opacity.value = withTiming(1, { duration: 100 })
  }, [])

  const shadow = shadowColors[variant]
  const bg = bgColors[variant]
  const radius = sizeRadius[size]
  const padding = sizePadding[size]
  const showShadow = variant !== 'ghost' && !isDisabled

  return (
    <View style={[fullWidth && { width: '100%' }, isDisabled && { opacity: 0.5 }]}>
      {/* 3D shadow base */}
      {showShadow && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: radius * 2 + padding.paddingVertical * 2 + 20, // approx button height
            backgroundColor: shadow,
            borderRadius: radius,
          }}
        />
      )}

      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
      >
        <Animated.View
          style={[
            animStyle,
            {
              backgroundColor: bg,
              borderRadius: radius,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              ...padding,
              ...(variant === 'secondary' && {
                borderWidth: 2,
                borderColor: '#14b8a6',
              }),
            },
          ]}
          className={cn(fullWidth && 'w-full', className)}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#14b8a6'}
            />
          ) : (
            <Text
              className={cn(
                'font-bold text-center',
                textVariantClasses[variant],
                textSizeClasses[size],
                textClassName
              )}
            >
              {children}
            </Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  )
}
