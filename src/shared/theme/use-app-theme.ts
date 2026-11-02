import { useContext } from 'react'

import { AppThemeContext } from './theme.context'

export function useAppTheme() {
  const context = useContext(AppThemeContext)

  if (!context) {
    throw new Error('useAppTheme использован вне провайдера')
  }
  return context
}
