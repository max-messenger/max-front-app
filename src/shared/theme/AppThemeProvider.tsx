import { MaxUI } from '@maxhub/max-ui'
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { type AppColorScheme, AppThemeContext } from './theme.context'

const COLOR_SCHEME_STORAGE_KEY = 'color-scheme'

function isAppColorScheme(value: unknown): value is AppColorScheme {
  return value === 'light' || value === 'dark'
}

function getInitialColorScheme(): AppColorScheme {
  const savedColorScheme = window.localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
  if (isAppColorScheme(savedColorScheme)) {
    return savedColorScheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [colorScheme, setColorScheme] = useState<AppColorScheme>(getInitialColorScheme)

  useEffect(() => {
    document.documentElement.dataset.colorScheme = colorScheme
    window.localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme)
  }, [colorScheme])

  const contextValue = useMemo(
    () => ({
      colorScheme,
      toggleColorScheme() {
        setColorScheme(currentColor => (currentColor === 'dark' ? 'light' : 'dark'))
      }
    }),
    [colorScheme]
  )

  return (
    <AppThemeContext.Provider value={contextValue}>
      <MaxUI colorScheme={colorScheme}>
        {children}
      </MaxUI>
    </AppThemeContext.Provider>
  )
}
