import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { writeFiles } from '@helpers'

import { EXAMPLE_PATHS } from '../constants'
import { logger, Spinner } from '../logger'
import {
  buildGitIgnore,
  buildMainIndexTS,
  buildMainSCSS,
  buildMainTSX,
  buildMockSetup,
} from '../templates'

/**
 * Удаляет файлы и директории примеров (entities/dog, features/toggle-theme и т.д.).
 * После удаления генерирует заглушки для Main страницы и mock-setup,
 * чтобы проект оставался рабочим без примеров.
 *
 * В режиме dry-run удаления и запись файлов не выполняются,
 * в лог выводится план действий.
 */
export async function cleanExamples(targetDir: string, dryRun = false): Promise<void> {
  const spinner = new Spinner(dryRun ? '[dry-run] Очистка примеров...' : 'Очистка примеров...')
  spinner.start()

  for (const examplePath of EXAMPLE_PATHS) {
    const fullPath = path.join(targetDir, examplePath)
    if (dryRun) {
      logger.info(`  [rm]     ${examplePath}`)
      continue
    }
    if (fs.existsSync(fullPath)) {
      await fsp.rm(fullPath, {
        recursive: true,
        force: true
      })
    }
  }

  await writeFiles([
    buildMainTSX(targetDir),
    buildMainSCSS(targetDir),
    buildMainIndexTS(targetDir),
    buildGitIgnore(targetDir),
    buildMockSetup(targetDir)
  ], targetDir, dryRun)
  await generateEnvFile(targetDir)

  spinner.stop(dryRun ? '[dry-run] План очистки сформирован' : 'Примеры удалены')
}

async function generateEnvFile(targetDir: string): Promise<void> {
  const envExampleContent = await fsp.readFile(path.join(targetDir, '.env.example'), 'utf-8')
  await fsp.writeFile(path.join(targetDir, '.env'), envExampleContent, 'utf-8')
}
