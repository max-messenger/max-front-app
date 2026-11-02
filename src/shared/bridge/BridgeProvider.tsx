import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'

import { loadBridge } from './bridge'
import { BridgeContext, type BridgeStatus } from './bridge.context'
import type { WebAppBridge } from './bridge.types'

export function BridgeProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<BridgeStatus>('loading')
  const [webApp, setWebApp] = useState<WebAppBridge | null>(null)

  useEffect(() => {
    let isMounted = true

    loadBridge().then((loadedWebApp: WebAppBridge) => {
      if (!isMounted) {
        return
      }

      setWebApp(loadedWebApp)
      setStatus(loadedWebApp ? 'ready' : 'unavailable')
    })

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      status,
      webApp,
      initData: webApp?.initData ?? ''
    }),
    [status, webApp]
  )

  return (
    <BridgeContext.Provider value={value}>
      {children}
    </BridgeContext.Provider>
  )
}
