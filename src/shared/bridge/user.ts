import { useBridge } from './bridge.context.ts'
import type { WebAppUser } from './bridge.types'

export function getBridgeUserName(user?: WebAppUser) {
  if (!user) {
    return 'Гость'
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  return fullName || user.username || 'Гость'
}

export function getBridgeUserAvatar(user?: WebAppUser) {
  return user?.photo_url ?? ''
}

export function getBridgeUserInitials(user?: WebAppUser) {
  const name = getBridgeUserName(user)

  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function useUserFromBridge() {
  const { webApp } = useBridge()

  const user = webApp?.initDataUnsafe?.user

  const userName = getBridgeUserName(user)
  const userAvatar = getBridgeUserAvatar(user)
  const userInitials = getBridgeUserInitials(user)

  return {
    userName,
    userAvatar,
    userInitials,
  }
}
