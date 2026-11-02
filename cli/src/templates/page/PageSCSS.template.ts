import path from 'node:path'

import { type FileSpec, type Names } from '../../types'

export const buildPageSCSS = ({ PascalCase }: Names, pageDir: string): FileSpec => ({
  relativePath: path.join(pageDir, `${PascalCase}.module.scss`),
  content: `.root {
  position: relative;
  width: 100%;
  max-width: 560px;
  min-height: 100%;
  margin: 0 auto;
}
`
})
