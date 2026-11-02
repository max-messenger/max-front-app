import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildModalSCSS = ({ PascalCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'ui', `${PascalCase}Modal`, `${PascalCase}Modal.module.scss`),
  content: `/* Стили для ${PascalCase}Modal */
`
})
