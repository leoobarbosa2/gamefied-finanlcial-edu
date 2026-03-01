import React, { useEffect } from 'react'
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface CompletionRingProps {
  pct: number      // 0–100
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
}

export function CompletionRing({
  pct,
  size = 48,
  stroke = 4,
  color = '#14b8a6',
  trackColor = '#e4e4e7',
}: CompletionRingProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = useSharedValue(circumference)

  useEffect(() => {
    const target = circumference - (pct / 100) * circumference
    progress.value = withTiming(target, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    })
  }, [pct])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }))

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  )
}
