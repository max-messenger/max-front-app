import { QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { BridgeProvider } from '@/shared/bridge'
import { AppThemeProvider } from '@/shared/theme'
import { ToastProvider } from '@/shared/toast'

import { queryClient } from './query-client'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <BridgeProvider>{children}</BridgeProvider>
        </QueryClientProvider>
      </ToastProvider>
    </AppThemeProvider>
  )
}
