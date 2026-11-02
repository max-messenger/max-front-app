import type { ComponentProps } from 'react'

import { classNames } from '@/shared/lib/class-names'

import styles from './Modal.module.scss'

export type ModalContentProps = ComponentProps<'div'>

export function ModalContent({ className, children, ...rest }: ModalContentProps) {
  return (
    <div className={classNames(styles.content, className)} {...rest}>
      {children}
    </div>
  )
}
