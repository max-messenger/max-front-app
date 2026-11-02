import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildQueryKeys = (
  { camelCase, kebabCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'query-keys.ts'),
  content: `export const ${camelCase}QueryKeys = {
  all: ['${kebabCase}s'] as const,

  list() {
    return [...${camelCase}QueryKeys.all, 'list'] as const
  },

  detail(id: string) {
    return [...${camelCase}QueryKeys.all, 'detail', id] as const
  }
}
`
})
