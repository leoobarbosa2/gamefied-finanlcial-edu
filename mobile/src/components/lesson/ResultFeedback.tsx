import React, { useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { CheckCircle, XCircle } from 'lucide-react-native'
import { Audio } from 'expo-av'
import type { PlayerStatus } from '../../store/lessonStore'
import type { AnswerResult } from '../../types'

interface ResultFeedbackProps {
  playerStatus: PlayerStatus
  answerResult: AnswerResult | null
}

export function ResultFeedback({ playerStatus, answerResult }: ResultFeedbackProps) {
  const translateY = useSharedValue(200)
  const correctSoundRef = useRef<Audio.Sound | null>(null)
  const wrongSoundRef = useRef<Audio.Sound | null>(null)

  useEffect(() => {
    Audio.Sound.createAsync(require('../../../assets/sounds/correct.mp3'))
      .then(({ sound }) => { correctSoundRef.current = sound })
      .catch(() => {}) // Sound file may not exist yet

    Audio.Sound.createAsync(require('../../../assets/sounds/wrong.wav'))
      .then(({ sound }) => { wrongSoundRef.current = sound })
      .catch(() => {})

    return () => {
      correctSoundRef.current?.unloadAsync()
      wrongSoundRef.current?.unloadAsync()
    }
  }, [])

  useEffect(() => {
    if (playerStatus === 'correct' || playerStatus === 'incorrect') {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 })
      if (playerStatus === 'correct') {
        correctSoundRef.current?.replayAsync().catch(() => {})
      } else {
        wrongSoundRef.current?.replayAsync().catch(() => {})
      }
    } else {
      translateY.value = withSpring(200)
    }
  }, [playerStatus])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  if (playerStatus !== 'correct' && playerStatus !== 'incorrect') return null

  const isCorrect = playerStatus === 'correct'

  return (
    <Animated.View
      style={animatedStyle}
      className={`px-5 pt-4 pb-6 border-t ${
        isCorrect
          ? 'bg-[#f0fdf4] dark:bg-[#052e16] border-[#16a34a] dark:border-[#4ade80]'
          : 'bg-[#fff1f2] dark:bg-[#4c0519] border-[#e11d48] dark:border-[#fb7185]'
      }`}
    >
      <View className="flex-row items-center gap-2 mb-1">
        {isCorrect ? (
          <CheckCircle size={20} color="#16a34a" />
        ) : (
          <XCircle size={20} color="#e11d48" />
        )}
        <Text
          className={`text-base font-bold ${
            isCorrect
              ? 'text-[#16a34a] dark:text-[#4ade80]'
              : 'text-[#e11d48] dark:text-[#fb7185]'
          }`}
        >
          {isCorrect ? 'Correto!' : 'Incorreto'}
        </Text>
      </View>
      {answerResult?.explanation && (
        <Text
          className={`text-sm leading-relaxed ${
            isCorrect
              ? 'text-[#15803d] dark:text-[#86efac]'
              : 'text-[#be123c] dark:text-[#fda4af]'
          }`}
        >
          {answerResult.explanation}
        </Text>
      )}
    </Animated.View>
  )
}
