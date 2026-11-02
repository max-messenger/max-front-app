import { type RefObject, useEffect } from 'react'

const FOCUSABLE_SELECTOR
  = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

function isVisibleFocusable(el: HTMLElement): boolean {
  if (el.getClientRects().length === 0) {
    return false
  }
  return getComputedStyle(el).visibility !== 'hidden'
}

type UseFocusTrapOptions = {
  /** Включает/выключает trap (например, пока модалка не смонтирована). */
  active: boolean
  /**
   * Возвращает `true`, если данный контейнер сейчас верхний в стеке
   * (нужно для корректной работы Tab при нескольких открытых модалках).
   */
  isTop: () => boolean
  /**
   * Элемент, на который нужно поставить фокус при открытии.
   * Если не указан — фокус ставится на `containerRef`.
   */
  initialFocusRef?: RefObject<HTMLElement | null>
}

/**
 * Удерживает фокус внутри `containerRef` (WAI-ARIA "focus trap") и
 * возвращает фокус на элемент-триггер при размонтировании.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  { active, isTop, initialFocusRef }: UseFocusTrapOptions
) {
  useEffect(() => {
    if (!active) return

    const container = containerRef.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    const elementToFocus = initialFocusRef?.current ?? container
    elementToFocus?.focus()

    function handleTabKey(event: KeyboardEvent) {
      if (event.key !== 'Tab' || !isTop()) return

      const currentContainer = containerRef.current
      if (!currentContainer) return

      const focusableElements = currentContainer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      const focusable = Array.from(focusableElements).filter(isVisibleFocusable)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const isOutside = !currentContainer.contains(document.activeElement)

      if (event.shiftKey) {
        if (document.activeElement === first || isOutside) {
          event.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last || isOutside) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleTabKey)

    return () => {
      window.removeEventListener('keydown', handleTabKey)
      previouslyFocused?.focus?.()
    }
    // containerRef/isTop/initialFocusRef — стабильные значения, эффект должен
    // выполняться только при монтировании/размонтировании (изменении active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
