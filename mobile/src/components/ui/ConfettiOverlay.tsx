import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { StyleSheet, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

export interface ConfettiRef {
  fire: () => void
}

const CONFETTI_COLORS = ['#14b8a6', '#f59e0b', '#6366f1', '#22c55e', '#f97316', '#ffffff', '#fb7185']

export const ConfettiOverlay = forwardRef<ConfettiRef>((_, ref) => {
  const cannon = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    fire: () => cannon.current?.start(),
  }))

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <ConfettiCannon
        ref={cannon}
        count={140}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
        explosionSpeed={350}
        fallSpeed={3000}
        colors={CONFETTI_COLORS}
      />
    </View>
  )
})
