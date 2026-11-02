import path from 'node:path'

import { type FileSpec, type Names } from '../../types'

export const buildPageEmpty = ({ PascalCase }: Names, pageDir: string): FileSpec => ({
  relativePath: path.join(pageDir, `${PascalCase}.tsx`),
  content: `import { Page } from '@/shared/ui/page'
import { Header } from '@/widgets/header'

import styles from './${PascalCase}.module.scss'

export function ${PascalCase}Page() {
  return (
    <Page>
      <div className={styles.root}>
        <Header />
      </div>
    </Page>
  )
}
`
})
