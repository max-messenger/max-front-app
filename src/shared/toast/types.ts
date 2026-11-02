import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastPlacement = 'top' | 'bottom'

export type ToastOptions = {
  type?: ToastType
  placement?: ToastPlacement
  title?: string
  description?: string
  icon?: ReactNode
  duration?: number
  onClick?: () => void
}

export type ToastItem = Required<Pick<ToastOptions, 'type' | 'placement' | 'duration'>>
  & Pick<ToastOptions, 'title' | 'description' | 'icon' | 'onClick'> & {
    id: string
    timer?: ReturnType<typeof setTimeout>
    isClosing?: boolean
  }

export type ToastContextValue = {
  show: (options: ToastOptions) => string
  hide: (id: string) => void
  clear: () => void
}
