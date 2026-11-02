import type { ComponentProps } from 'react'

import { classNames } from '@/shared/lib/class-names'

import styles from './Modal.module.scss'

export type ModalButtonsProps = ComponentProps<'div'>

export function ModalButtons({ className, children, ...rest }: ModalButtonsProps) {
  return (
    <div className={classNames(styles.buttons, className)} {...rest}>
      {children}
    </div>
  )
}
