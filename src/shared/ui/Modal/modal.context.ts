import { createContext, useContext } from 'react'

export type ModalIdContextValue = {
  titleId: string
}

export const ModalIdContext = createContext<ModalIdContextValue | null>(null)

export function useModalTitleId() {
  return useContext(ModalIdContext)?.titleId
}
