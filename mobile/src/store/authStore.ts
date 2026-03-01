import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'
import type { User } from '../types'

const SECURE_TOKEN_KEY = 'finlearn_access_token'
const SECURE_REFRESH_KEY = 'finlearn_refresh_token'

interface AuthState {
  user: User | null
  isAuthenticated: boolean

  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>
  updateUser: (updates: Partial<User>) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: async (user, accessToken, refreshToken) => {
        await SecureStore.setItemAsync(SECURE_TOKEN_KEY, accessToken)
        if (refreshToken) {
          await SecureStore.setItemAsync(SECURE_REFRESH_KEY, refreshToken)
        }
        set({ user, isAuthenticated: true })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : state.user,
        })),

      logout: async () => {
        await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY)
        await SecureStore.deleteItemAsync(SECURE_REFRESH_KEY)
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'finlearn-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helpers for API client to access tokens without subscribing to store
export const getAccessToken = () => SecureStore.getItemAsync(SECURE_TOKEN_KEY)
export const getRefreshToken = () => SecureStore.getItemAsync(SECURE_REFRESH_KEY)
export const setAccessToken = (token: string) => SecureStore.setItemAsync(SECURE_TOKEN_KEY, token)
export const setRefreshToken = (token: string) => SecureStore.setItemAsync(SECURE_REFRESH_KEY, token)
export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY)
  await SecureStore.deleteItemAsync(SECURE_REFRESH_KEY)
}
