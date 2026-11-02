import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { logger } from '../logger'
import { buildMockCall, buildMockImport } from '../templates'
import { type Names } from '../types'

/**
 * Обновляет src/app/mock-setup.ts — добавляет импорт и вызов регистрации моков.
 *
 * Если файл не существует — создаёт его.
 * Если импорт уже присутствует — пропускает.
 */
export async function updateMockSetup(
  targetDir: string,
  names: Names,
  dryRun: boolean,
): Promise<void> {
  const mockSetupPath = path.join(targetDir, 'src', 'app', 'mock-setup.ts')

  const importLine = buildMockImport(names.PascalCase, names.kebabCase)
  const callLine = buildMockCall(names.PascalCase)

  if (dryRun) {
    if (fs.existsSync(mockSetupPath)) {
      logger.info(`  [update]  src/app/mock-setup.ts (+import, +call)`)
    } else {
      logger.info(`  [create]  src/app/mock-setup.ts`)
    }
    return
  }

  let content: string

  if (fs.existsSync(mockSetupPath)) {
    content = await fsp.readFile(mockSetupPath, 'utf-8')

    // Проверяем, не добавлен ли уже импорт
    if (content.includes(importLine)) {
      logger.info('  mock-setup.ts уже содержит импорт')
      return
    }
  } else {
    // Файл не существует — создаём с нуля
    content = `export function setupMocks(): void {
  // Регистрация mock-обработчиков
}
`
  }

  // Добавляем импорт перед функцией setupMocks
  const setupFnIndex = content.indexOf('export function setupMocks')
  if (setupFnIndex === -1) {
    logger.warn(`  Не удалось найти setupMocks() в mock-setup.ts — добавьте вручную:`)
    logger.raw(`    ${importLine}`)
    logger.raw(`    ${callLine}`)
    return
  }

  const beforeFn = content.slice(0, setupFnIndex)
  const fnBody = content.slice(setupFnIndex)

  // Добавляем импорт в начало файла
  const updatedBefore = importLine + '\n' + beforeFn.trimEnd() + '\n'

  // Добавляем вызов внутрь функции setupMocks
  // Ищем закрывающую скобку функции
  const closingBraceIndex = fnBody.lastIndexOf('}')
  if (closingBraceIndex === -1) {
    logger.warn('  Не удалось найти закрывающую скобку в setupMocks() — добавьте вручную:')
    logger.raw(`    ${callLine}`)
    return
  }

  const beforeCall = fnBody.slice(0, closingBraceIndex).trimEnd()
  const afterCall = fnBody.slice(closingBraceIndex)

  const updatedFnBody = beforeCall + '\n' + callLine + '\n' + afterCall

  const updatedContent = updatedBefore + updatedFnBody

  await fsp.writeFile(mockSetupPath, updatedContent, 'utf-8')
  logger.info('  mock-setup.ts обновлён')
}
