import fs from 'node:fs'
import path from 'node:path'

import { logger } from '../logger'
import { runConfirmPrompt } from '../prompts'
import type { CliOptions } from '../types'

export async function checkTargetDir(targetDir: string, options: CliOptions) {
  const resolvedTargetDir = path.resolve(targetDir)
  if (fs.existsSync(resolvedTargetDir) && fs.readdirSync(resolvedTargetDir).length > 0) {
    logger.warn(`Целевая директория не пуста: ${resolvedTargetDir}`)
    logger.warn('Существующие файлы могут быть перезаписаны')

    if (options.skipPrompts || options.dryRun) {
      logger.warn('Продолжаю, так как интерактивные промпты отключены')
    } else {
      const response = await runConfirmPrompt('proceed', 'Продолжить?')

      if (!response.proceed) {
        logger.info('Операция отменена пользователем.')
        process.exit(0)
      }
    }

    logger.newLine()
  }
}
