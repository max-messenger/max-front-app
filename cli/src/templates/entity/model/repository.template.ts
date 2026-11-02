import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildRepository = (
  { camelCase, PascalCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'repository.ts'),
  content: `import { get${PascalCase}Api, get${PascalCase}sApi } from '../api/api'

export const ${camelCase}Repository = {
  get${PascalCase}s(signal?: AbortSignal) {
    return get${PascalCase}sApi(signal)
  },

  get${PascalCase}(id: string, signal?: AbortSignal) {
    return get${PascalCase}Api(id, signal)
  }
}
`
})
