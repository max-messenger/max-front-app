import fsp from 'node:fs/promises'
import path from 'node:path'

import { type FileSpec } from '../types'

const buildTestBlock = (setupFile: string) => `  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['${setupFile}'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}']
  }`

/**
 *  1. Импорт `defineConfig` переключается с `'vite'` на `'vitest/config'`
 *  2. В объект конфига дописывается блок `test: { ... }`, если его ещё нет.\
 */
export const updateViteConfig = async (targetDir: string, setupFile: string): Promise<FileSpec> => {
  const filePath = path.join(targetDir, 'vite.config.ts')
  let content = await fsp.readFile(filePath, 'utf-8')

  content = content.replace(
    /(import\s+\{[^}]*\bdefineConfig\b[^}]*\}\s+from\s+['"])vite(['"])/,
    '$1vitest/config$2'
  )

  if (!/^\s*test\s*:/m.test(content)) {
    const block = buildTestBlock(setupFile)
    const endMatch = content.match(/(\s*)(\})((?:\))+)(\s*)$/)
    if (!endMatch) {
      throw new Error(
        'Не удалось определить структуру vite.config.ts для добавления секции test. '
        + 'Добавьте блок test вручную.'
      )
    }
    const [full, , closeBrace, parens, trailWs] = endMatch
    const before = content.slice(0, content.length - full.length).replace(/\s+$/, '')
    const sep = before.endsWith(',') ? '' : ','
    content = `${before}${sep}\n${block}\n${closeBrace}${parens}${trailWs}`
  }

  return {
    relativePath: filePath,
    content
  }
}
