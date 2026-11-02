import { classNames } from '@/shared/lib/class-names'
import type { ToastItem, ToastPlacement } from '@/shared/toast'

import { Toast } from './Toast'
import styles from './Toast.module.scss'

type ToastContainerProps = {
  toasts: ToastItem[]
  onHide: (id: string) => void
}

const PLACEMENTS: ToastPlacement[] = ['top', 'bottom']

export function ToastContainer({
  toasts, onHide
}: ToastContainerProps) {
  return (
    <>
      {PLACEMENTS.map((placement) => {
        const placementToasts = toasts.filter(toast => toast.placement === placement)

        if (placementToasts.length === 0) {
          return null
        }

        return (
          <div key={placement} className={classNames(styles.stack, styles[`stack_${placement}`])}>
            {placementToasts.map(toast => (
              <Toast key={toast.id} toast={toast} onHide={onHide} />
            ))}
          </div>
        )
      })}
    </>
  )
}
