import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'

import { logger } from '../logger'
import { buildPageImport, buildPageRoute } from '../templates'
import { type Names } from '../types'

/**
 * Обновляет src/app/router/AppRouter.tsx — добавляет импорт страницы и её роут.
 *
 * Импорт вставляется в блок импортов (после последнего `import`).
 * Роут вставляется перед catch-all роутом `<Route path="*" ... />`.
 *
 * Если файл не существует — инструкция для ручного добавления.
 * Если импорт и роут уже присутствуют — пропускает.
 */
export async function updateAppRouter(
  targetDir: string,
  names: Names,
  dryRun: boolean,
): Promise<void> {
  const routerPath = path.join(targetDir, 'src', 'app', 'router', 'AppRouter.tsx')

  const importLine = buildPageImport(names.PascalCase)
  const routeLine = buildPageRoute(names.kebabCase, names.PascalCase)

  if (dryRun) {
    if (fs.existsSync(routerPath)) {
      logger.info('  [update]  src/app/router/AppRouter.tsx (+import, +route)')
    } else {
      logger.info('  [create]  src/app/router/AppRouter.tsx')
    }
    return
  }

  if (!fs.existsSync(routerPath)) {
    logger.warn('  Не найден src/app/router/AppRouter.tsx — добавьте вручную:')
    logger.raw(`    ${importLine}`)
    logger.raw(`    ${routeLine}`)
    return
  }

  const content = await fsp.readFile(routerPath, 'utf-8')

  const hasImport = content.includes(importLine)
  const hasRoute = content.includes(routeLine)
  if (hasImport && hasRoute) {
    logger.info('  AppRouter.tsx уже содержит страницу')
    return
  }

  const lines = content.split('\n')

  // 1. Вставляем импорт после последнего `import`-а (в блок импортов)
  if (!hasImport) {
    let lastImportIdx = -1
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIdx = i
      }
    }

    if (lastImportIdx === -1) {
      logger.warn('  Не удалось найти блок импортов в AppRouter.tsx — добавьте вручную:')
      logger.raw(`    ${importLine}`)
    } else {
      lines.splice(lastImportIdx + 1, 0, importLine)
    }
  }

  // 2. Вставляем роут перед catch-all `<Route path="*"`
  if (!hasRoute) {
    const catchAllIdx = lines.findIndex(l => l.includes('<Route path="*"'))
    if (catchAllIdx === -1) {
      logger.warn('  Не удалось найти catch-all роут в AppRouter.tsx — добавьте вручную:')
      logger.raw(`    ${routeLine}`)
    } else {
      // Если перед catch-all есть пустая строка — вставляем до неё,
      // чтобы новый роут примыкал к остальным роутам.
      const insertIdx = catchAllIdx > 0 && lines[catchAllIdx - 1].trim() === ''
        ? catchAllIdx - 1
        : catchAllIdx
      lines.splice(insertIdx, 0, routeLine)
    }
  }

  await fsp.writeFile(routerPath, lines.join('\n'), 'utf-8')
  logger.info('  AppRouter.tsx обновлён')
}
