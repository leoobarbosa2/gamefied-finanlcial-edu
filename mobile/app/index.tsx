import { Redirect } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../src/store/authStore'

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  if (!hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#14b8a6" />
      </View>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/dashboard" />
  }

  return <Redirect href="/landing" />
}
