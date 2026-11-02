import {
  type MouseEvent, type ReactNode, type RefObject, useEffect, useId, useRef
} from 'react'
import { createPortal } from 'react-dom'

import { classNames } from '@/shared/lib/class-names'
import { useBodyScrollLock } from '@/shared/lib/use-body-scroll-lock'
import { useFocusTrap } from '@/shared/lib/use-focus-trap'

import { ModalIdContext } from './modal.context'
import styles from './Modal.module.scss'
import { isTopModal, popModal, pushModal } from './modal-stack'
import { ModalButtons } from './ModalButtons'
import { ModalContent } from './ModalContent'
import { ModalTitle } from './ModalTitle'
export type ModalSize = 'small' | 'large' | 'xl'

/**
 * Контейнер портала внутри поддерева MaxUI-провайдера:
 * токены MaxUI скоуплены на классе провайдера, поэтому портал в `document.body`
 * остался бы без переменных (нет фона/цвета текста после обновления MaxUI до 0.3.2).
 */
function getPortalContainer(): HTMLElement {
  return document.getElementById('modal-root') ?? document.body
}

export type ModalProps = {
  /**
   * Колбэк, на закрытие
   */
  onClose: () => void
  /**
   * Если `true`, нажатие Escape вызывает `onClose`.
   */
  closeOnEsc?: boolean
  /**
   * Если `true`, клик по бэкдропу (вне модалки) вызывает `onClose`.
   */
  closeOutside?: boolean
  /**
   * Минимальная ширина модалки.
   */
  size: ModalSize
  /**
   * Элемент, на который нужно поставить фокус при открытии.
   * Если не указан, фокус ставится на контейнер диалога.
   */
  initialFocusRef?: RefObject<HTMLElement | null>
  /**
   * Содержимое модалки. Обычно состоит из `Modal.Title`, `Modal.Content`, `Modal.Buttons`.
   */
  children: ReactNode
}

export function Modal({
  onClose,
  closeOnEsc = true,
  closeOutside = true,
  size,
  initialFocusRef,
  children
}: ModalProps) {
  const modalId = useId()
  const titleId = useId()
  const modalRef = useRef<HTMLDivElement>(null)

  useBodyScrollLock()

  useFocusTrap(modalRef, {
    active: true,
    isTop: () => isTopModal(modalId),
    initialFocusRef
  })

  // Регистрация модалки в стеке (нужно для приоритета верхней модалки в focus-trap и Escape)
  useEffect(() => {
    pushModal(modalId)
    return () => {
      popModal(modalId)
    }
  }, [modalId])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && closeOnEsc && isTopModal(modalId)) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeOnEsc, modalId, onClose])

  function handleOverlayMouseDown() {
    if (closeOutside) {
      onClose()
    }
  }

  function handleModalMouseDown(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={classNames(styles.modal, styles[size])}
        onMouseDown={handleModalMouseDown}
      >
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Закрыть"
          onClick={onClose}
        />
        <ModalIdContext.Provider value={{ titleId }}>
          {children}
        </ModalIdContext.Provider>
      </div>
    </div>,
    getPortalContainer()
  )
}

Modal.Title = ModalTitle
Modal.Content = ModalContent
Modal.Buttons = ModalButtons
