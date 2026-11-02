/**
 * Глобальный реестр открытых модалок. Нужен, чтобы при нескольких
 * одновременно смонтированных `Modal` события Escape/Tab обрабатывала
 * только верхняя (последняя открытая) модалка.
 */
let modalStack: string[] = []

export function pushModal(id: string) {
  modalStack = [...modalStack, id]
}

export function popModal(id: string) {
  modalStack = modalStack.filter(stackId => stackId !== id)
}

export function isTopModal(id: string) {
  return modalStack[modalStack.length - 1] === id
}

export function getOpenModalCount() {
  return modalStack.length
}
