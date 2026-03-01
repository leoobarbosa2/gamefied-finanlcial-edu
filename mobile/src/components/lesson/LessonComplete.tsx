import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { Star, Zap, Coins, TrendingUp } from 'lucide-react-native'
import { Button } from '../ui/Button'
import type { CompleteLessonResult, Lesson } from '../../types'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface LessonCompleteProps {
  lesson: Lesson
  result: CompleteLessonResult
  score: number
  onBack: () => void
}

export function LessonComplete({ lesson, result, score, onBack }: LessonCompleteProps) {
  const RING_SIZE = 140
  const STROKE = 12
  const radius = (RING_SIZE - STROKE) / 2
  const circumference = 2 * Math.PI * radius

  const strokeOffset = useSharedValue(circumference)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)

  const [displayXp, setDisplayXp] = useState(0)
  const [displayCoins, setDisplayCoins] = useState(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 })
    scale.value = withSpring(1, { damping: 15 })
    strokeOffset.value = withDelay(
      300,
      withTiming(circumference - (score / 100) * circumference, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    )

    // Animate counters
    const xpTarget = result.xpEarned
    const coinsTarget = result.coinsEarned
    const duration = 1200
    const interval = 30
    const steps = duration / interval
    let step = 0
    const timer = setInterval(() => {
      step++
      const t = step / steps
      setDisplayXp(Math.round(xpTarget * Math.min(t, 1)))
      setDisplayCoins(Math.round(coinsTarget * Math.min(t, 1)))
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeOffset.value,
  }))

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const readHeadings = lesson.steps
    .filter((s) => s.stepType === 'READ')
    .map((s) => (s.content as any).heading as string)
    .filter(Boolean)

  return (
    <Animated.View style={[containerStyle, { flex: 1 }]}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold text-[#09090b] dark:text-[#f4f4f5] mb-2 text-center">
          Lição concluída!
        </Text>
        {result.leveledUp && (
          <View className="bg-accent-100 dark:bg-accent-900 px-4 py-1.5 rounded-full mb-4">
            <Text className="text-sm font-bold text-accent-600 dark:text-accent-300">
              🎉 Subiu para nível {result.newLevel}!
            </Text>
          </View>
        )}

        {/* Score ring */}
        <View className="items-center justify-center mb-6" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke="#e4e4e7"
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              stroke="#14b8a6"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View className="items-center">
            <Text className="text-4xl font-bold text-[#09090b] dark:text-[#f4f4f5]">
              {score}%
            </Text>
            <Text className="text-xs text-[#71717a] dark:text-[#8b8b98]">pontuação</Text>
          </View>
        </View>

        {/* Rewards */}
        <View className="flex-row gap-3 mb-6 w-full">
          <View className="flex-1 bg-accent-50 dark:bg-accent-900/30 rounded-2xl p-4 items-center border border-accent-200 dark:border-accent-800">
            <Zap size={20} color="#0d9488" />
            <Text className="text-2xl font-bold text-accent-600 dark:text-accent-300 mt-1">
              +{displayXp}
            </Text>
            <Text className="text-xs text-accent-500">XP</Text>
          </View>
          <View className="flex-1 bg-amber-50 dark:bg-amber-950 rounded-2xl p-4 items-center border border-amber-200 dark:border-amber-900">
            <Coins size={20} color="#d97706" />
            <Text className="text-2xl font-bold text-amber-600 dark:text-amber-300 mt-1">
              +{displayCoins}
            </Text>
            <Text className="text-xs text-amber-500">moedas</Text>
          </View>
        </View>

        {/* What you learned */}
        {readHeadings.length > 0 && (
          <View className="w-full bg-white dark:bg-[#24242c] rounded-2xl border border-[#e4e4e7] dark:border-[#2a2a32] p-4 mb-6">
            <View className="flex-row items-center gap-2 mb-3">
              <TrendingUp size={16} color="#14b8a6" />
              <Text className="text-sm font-semibold text-[#09090b] dark:text-[#f4f4f5]">
                O que você aprendeu
              </Text>
            </View>
            {readHeadings.map((heading, i) => (
              <View key={i} className="flex-row items-start gap-2 mb-2">
                <Text className="text-accent-500 mt-0.5">✓</Text>
                <Text className="text-sm text-[#3f3f46] dark:text-[#d4d4d8] flex-1">
                  {heading}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Button variant="primary" size="lg" fullWidth onPress={onBack}>
          Voltar à trilha
        </Button>
      </ScrollView>
    </Animated.View>
  )
}
