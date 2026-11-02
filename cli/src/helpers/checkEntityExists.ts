import fs from 'node:fs'
import path from 'node:path'

import { logger } from '../logger'
import { runConfirmPrompt } from '../prompts'
import { resolveEntityNames } from './naming'

export interface CheckEntityResult {
  /** Использовать ли найденную сущность на странице */
  confirm: boolean
  /** Имя сущности (имя папки в src/entities) или пустая строка */
  entityName: string
}

/**
 * Приводит слово к единственному числу.
 * Поддерживает базовые правила английского:
 *   stories → story, boxes → box, dishes → dish, dogs → dog
 */
function singularize(word: string): string {
  const w = word.toLowerCase()
  if (w.endsWith('ies') && w.length > 3) {
    return w.slice(0, -3) + 'y' // stories → story
  }
  if (/(?:s|x|z|ch|sh)es$/.test(w) && w.length > 2) {
    return w.slice(0, -2) // boxes → box, dishes → dish
  }
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 1) {
    return w.slice(0, -1) // dogs → dog, users → user
  }
  return w
}

/**
 * Возвращает имя сущности-кандидата (kebab-case, единственное число последнего слова).
 *   "Users"    → "user"
 *   "BigDogs"  → "big-dog"
 *   "Products" → "product"
 */
function candidateEntityName(pageName: string): string {
  const kebab = resolveEntityNames(pageName).kebabCase
  const parts = kebab.split('-').filter(Boolean)
  if (parts.length === 0) return ''
  parts[parts.length - 1] = singularize(parts[parts.length - 1])
  return parts.join('-')
}

/**
 * Проверяет, создана ли в targetDir/src/entities сущность с похожим названием.
 * Сопоставляет имя страницы (например, "Users") с сущностью (например, "user").
 *
 * Если сущность найдена — спрашивает пользователя через runConfirmPrompt,
 * использовать ли её. Возвращает решение и имя найденной сущности.
 */
export async function checkEntityExists(
  pageName: string,
  targetDir: string,
  dryRun = false,
): Promise<CheckEntityResult> {
  const entitiesDir = path.join(targetDir, 'src', 'entities')

  // Кандидаты: единственное число (user) и исходное множественное (users)
  const singular = candidateEntityName(pageName)
  const plural = resolveEntityNames(pageName).kebabCase
  const candidates = Array.from(new Set([singular, plural].filter(Boolean)))

  let foundEntityName = ''
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(entitiesDir, candidate))) {
      foundEntityName = candidate
      break
    }
  }

  if (!foundEntityName) {
    return {
      confirm: false,
      entityName: ''
    }
  }

  if (dryRun) {
    logger.info(`  [detect]  Найдена сущность src/entities/${foundEntityName}`)
    logger.info('  Продолжаю, так как интерактивные промпты отключены')
    return {
      confirm: false,
      entityName: foundEntityName
    }
  }

  const response = await runConfirmPrompt(
    'useEntity',
    `Найдена сущность src/entities/${foundEntityName}. Использовать её на странице?`,
  )

  return {
    confirm: Boolean(response.useEntity),
    entityName: foundEntityName,
  }
}
