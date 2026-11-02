import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildMockJSON = ({ kebabCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'model', 'mock', `${kebabCase}.json`),
  content: `{
  "data": [
    {
      "id": "1",
      "name": "Пример ${kebabCase} 1",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "2",
      "name": "Пример ${kebabCase} 2",
      "createdAt": "2024-03-22T14:45:00.000Z"
    }
  ]
}
`
})
