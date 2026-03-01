import { useColorScheme } from 'react-native'
import { lightColors, darkColors, type ColorTokens } from '../constants/colors'

export function useColors(): ColorTokens {
  const scheme = useColorScheme()
  return scheme === 'dark' ? darkColors : lightColors
}
