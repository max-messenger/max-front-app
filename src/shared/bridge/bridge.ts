import { config } from '@/shared/config'

import type { WebAppBridge } from './bridge.types'

let bridgePromise: Promise<WebAppBridge | null> | null = null

function getExistingBridge() {
  return window.WebApp ?? null
}

function findBridgeScript() {
  return document.querySelector<HTMLScriptElement>(`script[src="${config.bridgeUrl}"]`)
}

export function getBridge() {
  if (typeof window === 'undefined') {
    return null
  }

  return getExistingBridge()
}

export function loadBridge() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  const existingBridge = getExistingBridge()

  if (existingBridge) {
    return Promise.resolve(existingBridge)
  }

  if (bridgePromise) {
    return bridgePromise
  }

  bridgePromise = new Promise((resolve) => {
    const existingScript = findBridgeScript()

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(getExistingBridge()), { once: true })
      existingScript.addEventListener('error', () => resolve(null), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = config.bridgeUrl
    script.async = true

    script.addEventListener('load', () => {
      const bridge = getExistingBridge()
      bridge?.ready?.()
      resolve(bridge)
    })

    script.addEventListener('error', () => {
      resolve(null)
    })

    document.head.append(script)
  })

  return bridgePromise
}
