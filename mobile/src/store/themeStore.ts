import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: (Appearance.getColorScheme() ?? 'light') as Theme,

      toggleTheme: () =>
        set((state) => {
          const next: Theme = state.theme === 'light' ? 'dark' : 'light'
          Appearance.setColorScheme(next)
          return { theme: next }
        }),

      setTheme: (theme) => {
        Appearance.setColorScheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'finlearn-theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) Appearance.setColorScheme(state.theme)
      },
    }
  )
)
