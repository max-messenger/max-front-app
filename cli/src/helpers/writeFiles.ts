import fsp from 'node:fs/promises'
import path from 'node:path'

import { logger } from '../logger'
import { type FileSpec } from '../types'

/**
 * Метод для генерации массива файлов типа FileSpec
 *
 * Возвращает количество сгенерированных файлов
 * */
export const writeFiles = async (
  files: FileSpec[], targetDir: string, dryRun?: boolean
): Promise<number> => {
  let created = 0

  for (const file of files) {
    const fileDir = path.dirname(file.relativePath)

    if (dryRun) {
      const relPath = path.relative(targetDir, file.relativePath)
      logger.info(`  [write]  ${relPath}`)
      created++
      continue
    }

    await fsp.mkdir(fileDir, { recursive: true })
    await fsp.writeFile(file.relativePath, file.content, 'utf-8')
    created++
  }

  return created
}
