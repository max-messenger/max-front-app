import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ToastContainer } from '@/shared/ui/Toast'

import {
  DEFAULT_TOAST_DURATION,
  DEFAULT_TOAST_PLACEMENT,
  DEFAULT_TOAST_TYPE,
  MAX_TOASTS_PER_PLACEMENT,
  TOAST_EXIT_ANIMATION_MS
} from './toast.constants'
import { ToastContext } from './toast.context'
import type { ToastItem, ToastOptions } from './types'

let toastIdCounter = 0

function generateToastId() {
  toastIdCounter += 1
  return `toast-${Date.now()}-${toastIdCounter}`
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastsRef = useRef<ToastItem[]>([])
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const exitTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const clearExitTimer = useCallback((id: string) => {
    const timer = exitTimersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      exitTimersRef.current.delete(id)
    }
  }, [])

  const removeToast = useCallback(
    (id: string) => {
      clearExitTimer(id)
      setToasts(current => current.filter(toast => toast.id !== id))
    },
    [clearExitTimer]
  )

  const hide = useCallback(
    (id: string) => {
      clearTimer(id)

      setToasts(current =>
        current.map(toast => (toast.id === id
          ? {
            ...toast,
            isClosing: true
          }
          : toast))
      )

      const exitTimer = setTimeout(() => {
        removeToast(id)
      }, TOAST_EXIT_ANIMATION_MS)
      exitTimersRef.current.set(id, exitTimer)
    },
    [clearTimer, removeToast]
  )

  const show = useCallback(
    (options: ToastOptions) => {
      const id = generateToastId()
      const placement = options.placement ?? DEFAULT_TOAST_PLACEMENT
      const duration = options.duration ?? DEFAULT_TOAST_DURATION

      const newToast: ToastItem = {
        id,
        type: options.type ?? DEFAULT_TOAST_TYPE,
        placement,
        duration,
        title: options.title,
        description: options.description,
        icon: options.icon,
        onClick: options.onClick
      }

      setToasts((current) => {
        const samePlacementToasts = current.filter(toast => toast.placement === placement)
        let next = current

        if (samePlacementToasts.length >= MAX_TOASTS_PER_PLACEMENT) {
          const oldestId = samePlacementToasts[0].id
          clearTimer(oldestId)
          clearExitTimer(oldestId)
          next = next.filter(toast => toast.id !== oldestId)
        }

        return [...next, newToast]
      })

      if (duration > 0) {
        const timer = setTimeout(() => {
          hide(id)
        }, duration)
        timersRef.current.set(id, timer)
      }

      return id
    },
    [clearExitTimer, clearTimer, hide]
  )

  const clear = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer))
    timersRef.current.clear()

    const currentToasts = toastsRef.current

    currentToasts.forEach((toast) => {
      clearExitTimer(toast.id)
      const exitTimer = setTimeout(() => {
        removeToast(toast.id)
      }, TOAST_EXIT_ANIMATION_MS)
      exitTimersRef.current.set(toast.id, exitTimer)
    })

    setToasts(current => current.map(toast => ({
      ...toast,
      isClosing: true
    })))
  }, [clearExitTimer, removeToast])

  useEffect(() => {
    const timers = timersRef.current
    const exitTimers = exitTimersRef.current

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      timers.clear()
      exitTimers.forEach(timer => clearTimeout(timer))
      exitTimers.clear()
    }
  }, [])

  const contextValue = useMemo(() => ({
    show,
    hide,
    clear
  }), [show, hide, clear])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onHide={hide} />
    </ToastContext.Provider>
  )
}
