import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildModelTypes = ({ PascalCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'types.ts'),
  content: `export type ${PascalCase} = {
  id: string
  name: string
  createdAt: string
}
`
})
