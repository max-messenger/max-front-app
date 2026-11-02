import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildApi = (
  { PascalCase, kebabCase, upperSnake }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'api', 'api.ts'),
  content: `import { apiRequest } from '@/shared/api'

import type { ${PascalCase}ListResponse, ${PascalCase}Response } from './types'

const ${upperSnake}_API_BASE = '/v1/${kebabCase}s'

export async function get${PascalCase}sApi(signal?: AbortSignal) {
  const response = await apiRequest<${PascalCase}ListResponse>(${upperSnake}_API_BASE, {
    method: 'GET',
    signal
  })
  return response.data
}

export async function get${PascalCase}Api(id: string, signal?: AbortSignal) {
  const response = await apiRequest<${PascalCase}Response>(\`\${${upperSnake}_API_BASE}/\${id}\`, {
    method: 'GET',
    signal
  })
  return response.data
}
`
})
