import type { CSSProperties, HTMLAttributes } from 'react'

import { classNames } from '@/shared/lib/class-names'

import styles from './FlexBox.module.scss'

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type JustifyContent
  = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type AlignContent
  = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'

export type FlexBoxProps = {
  direction?: FlexDirection
  wrap?: FlexWrap
  justifyContent?: JustifyContent
  alignItems?: AlignItems
  alignContent?: AlignContent
  gap?: number
  rowGap?: string
  columnGap?: string
} & HTMLAttributes<HTMLDivElement>

export function FlexBox({
  direction,
  wrap,
  justifyContent,
  alignItems,
  alignContent,
  gap,
  rowGap,
  columnGap,
  className = '',
  children,
  style,
  ...rest
}: FlexBoxProps) {
  const flexStyle: CSSProperties = {
    ...(direction && { flexDirection: direction }),
    ...(wrap && { flexWrap: wrap }),
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
    ...(alignContent && { alignContent }),
    ...(gap && { gap: `${gap}px` }),
    ...(rowGap && { rowGap }),
    ...(columnGap && { columnGap })
  }

  return (
    <div
      className={classNames(styles.flexbox, className)}
      style={{
        ...flexStyle,
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
