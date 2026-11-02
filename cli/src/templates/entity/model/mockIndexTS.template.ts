import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildMockIndexTS = (
  { camelCase, kebabCase, PascalCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'mock', 'index.ts'),
  content: `import { type MockHandler, registerMock } from '@/shared/api/mock-registry'

import type { ${PascalCase}ListResponse, ${PascalCase}Response } from '../../api/types'
import ${camelCase}Mock from './${kebabCase}.json'

export function register${PascalCase}Mocks(): void {
  registerMock('GET', '/v1/${kebabCase}s', ${camelCase}Mock as ${PascalCase}ListResponse)

  const get${PascalCase}Handler: MockHandler = ({ params }): ${PascalCase}Response | null => {
    const item = (${camelCase}Mock as ${PascalCase}ListResponse).data.find(d => d.id === params.id)
    return item ? { data: item } : null
  }
  registerMock('GET', '/v1/${kebabCase}s/:id', get${PascalCase}Handler)
}
`
})
