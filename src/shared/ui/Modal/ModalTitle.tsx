import { Typography } from '@maxhub/max-ui'
import { type ComponentProps } from 'react'

import { classNames } from '@/shared/lib/class-names'

import { useModalTitleId } from './modal.context'
import styles from './Modal.module.scss'

export type ModalTitleProps = ComponentProps<'div'>

export function ModalTitle({ className, children, ...rest }: ModalTitleProps) {
  const titleId = useModalTitleId()

  return (
    <div id={titleId} className={classNames(styles.title, className)} {...rest}>
      <Typography.Headline variant="large-strong">
        {children}
      </Typography.Headline>
    </div>
  )
}
