import React, { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { PlayCircle, Clock, Zap } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import type { ContinueLesson } from '../../types'

interface ContinueCardProps {
  lesson: ContinueLesson
}

export function ContinueCard({ lesson }: ContinueCardProps) {
  const router = useRouter()
  const pulseScale = useSharedValue(1)
  const cardScale = useSharedValue(1)

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 700 }),
        withTiming(1.00, { duration: 700 })
      ),
      -1,
      false
    )
  }, [])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }))

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }))

  const onPressIn = () => {
    cardScale.value = withSpring(0.97, { damping: 20, stiffness: 400 })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
  const onPressOut = () => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }

  return (
    <Pressable
      onPress={() => router.push(`/(app)/lessons/${lesson.lessonId}`)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={cardStyle}>
        <LinearGradient
          colors={['#0d9488', '#14b8a6', '#0ea5a0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 20, padding: 18 }}
        >
          {/* Tag */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <Zap size={12} color="rgba(255,255,255,0.85)" fill="rgba(255,255,255,0.85)" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1, textTransform: 'uppercase' }}>
              Continue de onde parou
            </Text>
          </View>

          <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff', marginBottom: 4, letterSpacing: -0.3 }} numberOfLines={2}>
            {lesson.lessonTitle}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
            {lesson.pathTitle}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Clock size={13} color="rgba(255,255,255,0.75)" />
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                {lesson.estimatedMins} min
              </Text>
            </View>

            {/* Pulsing CTA button */}
            <Animated.View style={[pulseStyle, {
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: 'rgba(255,255,255,0.22)',
              paddingHorizontal: 16, paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
            }]}>
              <PlayCircle size={15} color="#fff" fill="#fff" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>
                Continuar
              </Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  )
}
