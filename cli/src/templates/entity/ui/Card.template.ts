import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildCard = ({ camelCase, PascalCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'ui', `${PascalCase}Card`, `${PascalCase}Card.tsx`),
  content: `import { CellSimple, Spinner, Typography } from '@maxhub/max-ui'

import type { ${PascalCase} } from '../../model/types'
import styles from './${PascalCase}Card.module.scss'

type ${PascalCase}CardProps = {
  ${camelCase}: ${PascalCase}
  loading?: boolean
  disabled?: boolean
  onOpen: (id: string) => void
}

export function ${PascalCase}Card({
  ${camelCase}, loading = false, disabled = false, onOpen
}: ${PascalCase}CardProps) {
  const isDisabled = disabled || loading

  return (
    <CellSimple
      as="button"
      height="normal"
      className={styles.root}
      disabled={isDisabled}
      innerClassNames={{
        content: styles.content,
        overline: styles.overline,
        title: styles.title,
        subtitle: styles.subtitle,
        after: styles.after
      }}
      title={<Typography.Title>{${camelCase}.name}</Typography.Title>}
      subtitle={<Typography.Label className={styles.meta}>{${camelCase}.id}</Typography.Label>}
      after={loading ? <Spinner size={24} appearance="primary" /> : null}
      onClick={() => onOpen(${camelCase}.id)}
    />
  )
}
`
})
