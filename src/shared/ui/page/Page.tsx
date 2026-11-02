import type { PropsWithChildren } from 'react'

import { classNames } from '@/shared/lib/class-names'

import styles from './Page.module.scss'
import { Panel } from './Panel'

type PageProps = PropsWithChildren<{
  className?: string
  mode?: 'primary' | 'secondary'
}>

export function Page({
  children, className, mode = 'primary'
}: PageProps) {
  return (
    <Panel mode={mode} className={classNames(styles.root, className)}>
      {children}
    </Panel>
  )
}
