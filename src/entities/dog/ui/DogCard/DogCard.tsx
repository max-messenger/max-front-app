import { CellSimple, Spinner, Typography } from '@maxhub/max-ui'

import { getAge } from '@/shared/lib/age-calculator'

import type { Dog } from '../../model/types'
import styles from './DogCard.module.scss'

type DogGridCardProps = {
  dog: Dog
  loading?: boolean
  disabled?: boolean
  onOpen: (dogKey: string) => void
}

export function DogCard({
  dog, loading = false, disabled = false, onOpen
}: DogGridCardProps) {
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
      title={<Typography.Title>{dog.name}</Typography.Title>}
      subtitle={<Typography.Label className={styles.meta}>{getAge(dog.age)}</Typography.Label>}
      before={dog.image && <img className={styles.image} src={dog.image} alt={dog.name} />}
      after={loading ? <Spinner size={24} appearance="primary" /> : null}
      onClick={() => onOpen(dog.key)}
    />
  )
}
