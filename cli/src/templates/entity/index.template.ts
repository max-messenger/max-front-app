import path from 'node:path'

import { type FileSpec, type Names } from '../../types'

export const buildIndexTS = (
  { PascalCase, camelCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'index.ts'),
  content: `export { use${PascalCase}Query, use${PascalCase}sQuery } from './model/queries'
export { ${camelCase}QueryKeys } from './model/query-keys'
export { ${camelCase}Repository } from './model/repository'
export type { ${PascalCase} } from './model/types'
export { ${PascalCase}Card } from './ui/${PascalCase}Card/${PascalCase}Card'
export { ${PascalCase}Modal } from './ui/${PascalCase}Modal/${PascalCase}Modal'
`
})
