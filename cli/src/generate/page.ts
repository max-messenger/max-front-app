import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { checkEntityExists, resolveEntityNames, writeFiles } from '@helpers'
import { updateAppRouter } from '@post-process/router'

import { logger, setLogLevel, Spinner } from '../logger'
import { buildPageTemplates } from '../templates'
import { type FileSpec, type GeneratePageOptions } from '../types'

export async function generatePage(
  pageName: string,
  targetDir: string,
  options: GeneratePageOptions
): Promise<void> {
  const {
    dryRun = false, force = false, quiet, skipRouter = false
  } = options
  if (quiet) {
    setLogLevel('quiet')
  }

  const names = resolveEntityNames(pageName)
  const pageDir = path.join(targetDir, 'src', 'pages', names.PascalCase)

  logger.newLine()
  logger.info(`Генерация страницы: ${names.PascalCase}`)
  logger.info(`  Имя (PascalCase): ${names.PascalCase}`)
  logger.info(`  Директория:       ${path.relative(targetDir, pageDir) || '.'}`)
  logger.newLine()

  // 1. Проверяем, что src/pages существует
  const pagesDir = path.join(targetDir, 'src', 'pages')
  if (!fs.existsSync(pagesDir)) {
    logger.error(`Директория не найдена: ${pagesDir}`)
    logger.error('Команду generate нужно запускать в корне проекта')
    process.exit(1)
  }

  // 2. Проверяем, не существует ли уже страница
  if (fs.existsSync(pageDir) && !force) {
    logger.error(`Страница уже существует: ${pageDir}`)
    logger.error('Запуск с флагом --force перезапишет страницу')
    process.exit(1)
  }

  // 3. Ищем одноименную сущность
  let entityName = ''
  const entityMatch = await checkEntityExists(pageName, targetDir, dryRun)
  if (entityMatch.confirm) {
    entityName = entityMatch.entityName
    logger.info(`  Будет использована сущность src/entities/${entityMatch.entityName}`)
  }

  const spinner = new Spinner(dryRun ? '[dry-run] Генерация файлов...' : 'Генерация файлов...')
  spinner.start()

  try {
    // 4. Генерируем шаблонные файлы
    const files: FileSpec[] = buildPageTemplates(names, pageDir, entityName)
    const created = await writeFiles(files, targetDir, dryRun)

    spinner.stop(dryRun ? '[dry-run] План генерации сформирован' : `Создано файлов: ${created}`)

    // 5. Обновляем AppRouter.tsx — добавляем импорт и роут страницы
    if (!skipRouter) {
      await updateAppRouter(targetDir, names, dryRun)
    }

    // 6. Итог
    logger.newLine()
    if (dryRun) {
      logger.warn('Dry-run завершён: изменения не применены')
      logger.newLine()
      logger.step('Проверьте план выше. Для реальной генерации уберите --dry-run')
    } else {
      logger.success(`Страница ${names.PascalCase} успешно сгенерирована!`)
      logger.newLine()
      logger.step('Сгенерированные файлы:')
      logger.raw(`    src/pages/${names.PascalCase}/index.ts`)
      logger.raw(`    src/pages/${names.PascalCase}/${names.PascalCase}.tsx`)
      logger.raw(`    src/pages/${names.PascalCase}/${names.PascalCase}.module.scss`)
      logger.newLine()
      logger.step('Публичный API:')
      logger.raw(`    ${names.PascalCase}Page — UI-компонент`)
      logger.newLine()
      logger.success(`Для просмотра перейдите на /${names.camelCase}`)
    }
  } catch (error) {
    spinner.stop()
    logger.error('Ошибка при генерации страницы')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    process.exit(1)
  }
}
