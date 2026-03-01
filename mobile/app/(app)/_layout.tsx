import React, { useEffect } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Home, BookOpen, User } from 'lucide-react-native'
import { useColorScheme } from 'react-native'
import { useAuthStore } from '../../src/store/authStore'

export default function AppLayout() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const scheme = useColorScheme()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login')
    }
  }, [isAuthenticated])

  const tabBarBg = scheme === 'dark' ? '#1c1c22' : '#ffffff'
  const tabBarBorder = scheme === 'dark' ? '#2a2a32' : '#e4e4e7'
  const activeColor = '#14b8a6'
  const inactiveColor = scheme === 'dark' ? '#8b8b98' : '#71717a'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="paths"
        options={{
          tabBarLabel: 'Trilhas',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  )
}
