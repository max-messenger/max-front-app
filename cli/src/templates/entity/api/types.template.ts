import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildApiTypes = ({ PascalCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'api', 'types.ts'),
  content: `import type { ${PascalCase} } from '../model/types'

export type ${PascalCase}Response = { data: ${PascalCase} }

export type ${PascalCase}ListResponse = { data: ${PascalCase}[] }
`
})
