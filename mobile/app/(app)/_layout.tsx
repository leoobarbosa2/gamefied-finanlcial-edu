import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Home, BookOpen, User } from 'lucide-react-native'
import { Pressable, useColorScheme, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useAuthStore } from '../../src/store/authStore'

// Animated tab button with bounce + haptic on selection
function AnimatedTabButton({
  children,
  onPress,
  accessibilityState,
  style,
}: any) {
  const scale = useSharedValue(1)
  const isSelected = accessibilityState?.selected

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.35, { damping: 8, stiffness: 250 }),
        withSpring(1.0, { damping: 12, stiffness: 200 })
      )
      Haptics.selectionAsync()
    }
  }, [isSelected])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Pressable
      onPress={onPress}
      style={[style, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}
      accessibilityState={accessibilityState}
    >
      <Animated.View style={animStyle}>
        {children}
      </Animated.View>
    </Pressable>
  )
}

export default function AppLayout() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated     = useAuthStore((s) => s._hasHydrated)
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  useEffect(() => {
    if (!hasHydrated) return
    if (!isAuthenticated) {
      router.replace('/(auth)/login')
    }
  }, [isAuthenticated, hasHydrated])

  const tabBarBg     = isDark ? '#1c1c22' : '#ffffff'
  const tabBarBorder = isDark ? '#2a2a32' : '#e4e4e7'
  const activeColor  = '#14b8a6'
  const inactiveColor = isDark ? '#8b8b98' : '#71717a'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 8,
          height: 62,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 0 },
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="paths"
        options={{
          tabBarLabel: 'Trilhas',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{ href: null }}
      />
    </Tabs>
  )
}
