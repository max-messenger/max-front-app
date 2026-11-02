import fs from 'node:fs'
import process from 'node:process'

import { checkTargetDir } from '@helpers'
import { runPostProcessing } from '@post-process'

import { getConfig } from './config'
import { getTemplateRoot } from './constants'
import { runCopyProcessing } from './copy'
import { logger, setLogLevel } from './logger'
import { type CliOptions } from './types'

export async function app(projectName: string | undefined, options: CliOptions): Promise<void> {
  if (options.quiet) {
    setLogLevel('quiet')
  }

  logger.newLine()
  logger.info('Создание нового проекта на базе max-front-app')
  logger.newLine()

  // 1. Определяем целевую директорию
  const targetDir = projectName ? projectName : '.'

  // 2. Определяем корень шаблона
  const templateRoot = options.template ?? getTemplateRoot()

  logger.info(`Шаблон: ${templateRoot}`)
  logger.info(`Целевая директория: ${targetDir}`)
  logger.newLine()

  // 3. Проверяем существование шаблона
  if (!fs.existsSync(templateRoot)) {
    logger.error(`Шаблон не найден: ${templateRoot}`)
    process.exit(1)
  }

  // 3.1 Проверяем, пуста ли целевая директория
  await checkTargetDir(targetDir, options)

  // 4. Сбор конфигурации
  const config = await getConfig(options, targetDir)

  if (config.dryRun) {
    logger.warn('Режим dry-run: файлы не записываются, команды не выполняются')
    logger.newLine()
  }

  // 5. Копирование шаблона
  await runCopyProcessing(config, templateRoot)

  // 6. Пост-обработка
  await runPostProcessing(config)

  // 7. Сообщение об успехе
  logger.newLine()
  if (config.dryRun) {
    logger.warn('Dry-run завершён: изменения не применены')
    logger.newLine()
    logger.step('Проверьте план выше. Для реального запуска уберите --dry-run')
  } else {
    logger.success('Проект успешно создан!')
    logger.newLine()
    logger.step('Обязательно! Замените переменные в .env на корректные ')
    logger.step('Для старта работы выполните:')
    logger.raw(`  cd ${config.targetDir}`)
    if (!config.installDeps) {
      logger.raw('  npm install')
    }
    logger.raw('  npm run dev')
  }
}
