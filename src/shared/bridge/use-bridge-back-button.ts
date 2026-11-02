import { useEffect, useRef } from 'react'

import { useBridge } from './bridge.context'

type UseBridgeBackButtonParams = {
  enabled: boolean
  onBack: () => void
}

export function useBridgeBackButton({
  enabled, onBack
}: UseBridgeBackButtonParams) {
  const { webApp } = useBridge()
  const onBackRef = useRef(onBack)

  useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  useEffect(() => {
    const backButton = webApp?.BackButton

    if (!enabled || !backButton) {
      return
    }

    const handler = () => onBackRef.current()
    backButton.show()
    backButton.onClick(handler)

    return () => {
      backButton.offClick(handler)
      backButton.hide()
    }
  }, [enabled, webApp])
}
