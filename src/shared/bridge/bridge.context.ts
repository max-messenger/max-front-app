import { createContext, useContext } from 'react'

import type { WebAppBridge } from './bridge.types'

export type BridgeStatus = 'idle' | 'loading' | 'ready' | 'unavailable'

export type BridgeContextValue = {
  status: BridgeStatus
  webApp: WebAppBridge | null
  initData: string
}

export const BridgeContext = createContext<BridgeContextValue | null>(null)

export function useBridge() {
  const context = useContext(BridgeContext)

  if (!context) {
    throw new Error('useBridge вне провайдера')
  }

  return context
}
