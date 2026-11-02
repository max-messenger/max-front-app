import path from 'node:path'

import { type FileSpec } from '../types'

export function buildSetupTests(targetDir: string, setupFilePath: string): FileSpec {
  return {
    content: `import '@testing-library/jest-dom/vitest'`,
    relativePath: path.join(targetDir, setupFilePath)
  }
}
