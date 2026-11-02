import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildQueries = (
  { camelCase, PascalCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'queries.ts'),
  content: `import { useQuery } from '@tanstack/react-query'

import { ${camelCase}QueryKeys } from './query-keys'
import { ${camelCase}Repository } from './repository'

export function use${PascalCase}sQuery() {
  return useQuery({
    queryKey: ${camelCase}QueryKeys.list(),
    queryFn: ({ signal }) => ${camelCase}Repository.get${PascalCase}s(signal)
  })
}

export function use${PascalCase}Query(id?: string) {
  return useQuery({
    queryKey: ${camelCase}QueryKeys.detail(id ?? ''),
    queryFn: ({ signal }) => ${camelCase}Repository.get${PascalCase}(id ?? '', signal),
    enabled: Boolean(id)
  })
}
`
})
