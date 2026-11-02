import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { resolveEntityNames, writeFiles } from '@helpers'
import { updateMockSetup } from '@post-process/mock-setup'

import { logger, setLogLevel, Spinner } from '../logger'
import { buildEntityTemplates } from '../templates'
import { type GenerateEntityOptions } from '../types'

export async function generateEntity(
  entityName: string,
  targetDir: string,
  options: GenerateEntityOptions
): Promise<void> {
  const {
    dryRun = false, skipMockSetup = false, force = false, quiet
  } = options
  if (quiet) {
    setLogLevel('quiet')
  }

  const names = resolveEntityNames(entityName)
  const entityDir = path.join(targetDir, 'src', 'entities', names.kebabCase)

  logger.newLine()
  logger.info(`Генерация сущности: ${names.PascalCase}`)
  logger.info(`  Имя (PascalCase): ${names.PascalCase}`)
  logger.info(`  Имя (camelCase):  ${names.camelCase}`)
  logger.info(`  Директория:       ${path.relative(targetDir, entityDir) || '.'}`)
  logger.newLine()

  // 1. Проверяем, что src/entities существует
  const entitiesDir = path.join(targetDir, 'src', 'entities')
  if (!fs.existsSync(entitiesDir)) {
    logger.error(`Директория не найдена: ${entitiesDir}`)
    logger.error('Команду generate нужно запускать в корне проекта')
    process.exit(1)
  }

  // 2. Проверяем, не существует ли уже сущность
  if (fs.existsSync(entityDir) && !force) {
    logger.error(`Сущность уже существует: ${entityDir}`)
    logger.error('Запуск с флагом --force перезапишет сущность')
    process.exit(1)
  }
  const spinner = new Spinner(dryRun ? '[dry-run] Генерация файлов...' : 'Генерация файлов...')
  spinner.start()

  try {
    // 3. Генерируем шаблонные файлы
    const files = buildEntityTemplates(names, entityDir)
    const created = await writeFiles(files, targetDir, dryRun)

    spinner.stop(dryRun ? '[dry-run] План генерации сформирован' : `Создано файлов: ${created}`)

    // 4. Обновляем mock-setup.ts
    if (!skipMockSetup) {
      await updateMockSetup(targetDir, names, dryRun)
    }

    // 5. Итог
    logger.newLine()
    if (dryRun) {
      logger.warn('Dry-run завершён: изменения не применены')
      logger.newLine()
      logger.step('Проверьте план выше. Для реальной генерации уберите --dry-run')
    } else {
      logger.success(`Сущность ${names.PascalCase} успешно сгенерирована!`)
      logger.newLine()
      logger.step('Сгенерированные файлы:')
      logger.raw(`    src/entities/${names.kebabCase}/index.ts`)
      logger.raw(`    src/entities/${names.kebabCase}/api/`)
      logger.raw(`    src/entities/${names.kebabCase}/model/`)
      logger.raw(`    src/entities/${names.kebabCase}/ui/`)
      logger.newLine()
      logger.step('Публичный API сущности:')
      logger.raw(`    use${names.PascalCase}sQuery, use${names.PascalCase}Query — React Query хуки`)
      logger.raw(`    ${names.PascalCase}Card, ${names.PascalCase}Modal — UI-компоненты`)
      logger.raw(`    ${names.camelCase}Repository — репозиторий для прямых вызовов`)
    }
  } catch (error) {
    spinner.stop()
    logger.error('Ошибка при генерации сущности')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    process.exit(1)
  }
}
