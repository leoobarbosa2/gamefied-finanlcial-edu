import '../global.css'
import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, Easing } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const SPLASH_DURATION = 2000 // ms before starting fade-out
const FADE_DURATION   = 350

function AppSplash({ onFinish }: { onFinish: () => void }) {
  const coinScale      = useRef(new Animated.Value(0)).current
  const coinOpacity    = useRef(new Animated.Value(0)).current
  const titleY         = useRef(new Animated.Value(20)).current
  const titleOpacity   = useRef(new Animated.Value(0)).current
  const taglineOpacity = useRef(new Animated.Value(0)).current
  const splashOpacity  = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.spring(coinScale,   { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
      Animated.timing(coinOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start()

    Animated.parallel([
      Animated.timing(titleOpacity, { toValue: 1, duration: 350, delay: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(titleY,       { toValue: 0, duration: 350, delay: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start()

    Animated.timing(taglineOpacity, { toValue: 1, duration: 400, delay: 550, easing: Easing.out(Easing.quad), useNativeDriver: true }).start()

    // Fixed timer — no dependency on any app state
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: FADE_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinish()
      })
    }, SPLASH_DURATION)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.splash, { opacity: splashOpacity }]}>
      <Animated.Text style={[styles.coin, { opacity: coinOpacity, transform: [{ scale: coinScale }] }]}>
        💰
      </Animated.Text>
      <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
        Finlearn
      </Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Aprenda. Cresça. Prospere.
      </Animated.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  splash:  { backgroundColor: '#14b8a6', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  coin:    { fontSize: 72, marginBottom: 16 },
  title:   { fontSize: 40, fontWeight: '800', color: '#ffffff', letterSpacing: -1, marginBottom: 10 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.82)', fontWeight: '500', letterSpacing: 0.2 },
})

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false)
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
          {!splashDone && <AppSplash onFinish={() => setSplashDone(true)} />}
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
