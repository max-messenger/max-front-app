import { useEffect } from 'react'

/**
 * Блокировка скролла `body` с учётом нескольких одновременно
 * заблокировавших скролл потребителей (ref-counting) и компенсацией
 * ширины скроллбара, чтобы избежать сдвига макета (layout shift).
 */
let lockCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

export function useBodyScrollLock() {
  useEffect(() => {
    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      savedOverflow = document.body.style.overflow
      savedPaddingRight = document.body.style.paddingRight

      document.body.style.overflow = 'hidden'

      if (scrollbarWidth > 0) {
        const currentPaddingRight = Number.parseFloat(
          getComputedStyle(document.body).paddingRight
        ) || 0
        document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`
      }
    }
    lockCount += 1

    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow
        document.body.style.paddingRight = savedPaddingRight
      }
    }
  }, [])
}
