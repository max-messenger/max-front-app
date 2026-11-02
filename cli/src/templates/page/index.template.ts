import path from 'node:path'

import type { FileSpec, Names } from '../../types'

export const buildIndexTS = (
  { PascalCase }: Names, pageDir: string
): FileSpec => ({
  relativePath: path.join(pageDir, 'index.ts'),
  content: `export { ${PascalCase}Page } from './${PascalCase}'
`
})
