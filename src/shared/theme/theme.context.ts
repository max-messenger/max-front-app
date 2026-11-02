import { createContext } from 'react'

export type AppColorScheme = 'light' | 'dark'

export type AppThemeContextValue = {
  colorScheme: AppColorScheme
  toggleColorScheme: () => void
}

export const AppThemeContext = createContext<AppThemeContextValue | null>(null)
