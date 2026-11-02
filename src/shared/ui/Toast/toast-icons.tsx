import type { ToastType } from '@/shared/toast'

export function getDefaultToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <path
            d="M6 10.5L8.5 13L14 7.5"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'error':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <path
            d="M7 7L13 13M13 7L7 13"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'warning':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <rect x="9.2" y="5" width="1.6" height="6.5" rx="0.8" fill="white" />
          <rect x="9.2" y="13" width="1.6" height="1.6" rx="0.8" fill="white" />
        </svg>
      )
    case 'info':
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="10" fill="currentColor" />
          <rect x="9.2" y="8.5" width="1.6" height="6.5" rx="0.8" fill="white" />
          <rect x="9.2" y="4.9" width="1.6" height="1.6" rx="0.8" fill="white" />
        </svg>
      )
  }
}
