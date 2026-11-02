export type WebAppPlatform = 'ios' | 'android' | 'desktop' | 'web'

export type WebAppChatType = 'DIALOG' | 'CHAT' | 'CHANNEL'

export type WebAppUser = {
  id: number
  first_name: string
  last_name: string
  username: string
  language_code: string
  photo_url?: string
}

export type WebAppChat = {
  id: number
  type: WebAppChatType
}

export type WebAppInitDataUnsafe = {
  query_id: string
  ip?: string
  auth_date?: number
  hash?: string
  user?: WebAppUser
  chat?: WebAppChat
  start_param?: string
  [key: string]: unknown
}

export type WebAppContact = {
  phone: string
}

export type WebAppBridge = {
  initData: string
  initDataUnsafe: WebAppInitDataUnsafe
  platform?: WebAppPlatform
  version?: string

  ready?: () => void
  BackButton?: {
    isVisible: boolean
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  enableClosingConfirmation?: () => void
  disableClosingConfirmation?: () => void
  [key: string]: unknown
}

declare global {
  interface Window {
    WebApp?: WebAppBridge
  }
}
