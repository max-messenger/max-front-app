import type { MouseEvent } from 'react'

import { classNames } from '@/shared/lib/class-names'
import type { ToastItem } from '@/shared/toast'

import styles from './Toast.module.scss'
import { getDefaultToastIcon } from './toast-icons'

type ToastProps = {
  toast: ToastItem
  onHide: (id: string) => void
}

export function Toast({
  toast, onHide
}: ToastProps) {
  const {
    id, type, title, description, icon, onClick, isClosing
  } = toast

  function handleClick() {
    onClick?.()
    onHide(id)
  }

  function handleCloseClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    onHide(id)
  }

  return (
    <div
      className={classNames(
        styles.toast,
        styles[type],
        isClosing && styles.closing,
        onClick && styles.clickable
      )}
      role="status"
      onClick={onClick ? handleClick : undefined}
    >
      <div className={styles.icon}>
        {icon ?? getDefaultToastIcon(type)}
      </div>

      <div className={styles.content}>
        {title
          ? (
            <div className={styles.title}>
              {title}
            </div>
          )
          : null}
        {description
          ? (
            <div className={styles.description}>
              {description}
            </div>
          )
          : null}
      </div>

      <button
        type="button"
        className={styles.closeButton}
        aria-label="Закрыть"
        onClick={handleCloseClick}
      />
    </div>
  )
}
