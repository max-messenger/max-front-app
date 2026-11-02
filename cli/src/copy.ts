import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import { isExcluded, isTransformable } from './constants'
import { logger, Spinner } from './logger'
import { transformContent } from './transformer'
import type { ProjectConfig, TransformContext } from './types'

export interface CopyResult {
  copied: number
  transformed: number
  skipped: number
}

export async function runCopyProcessing(config: ProjectConfig, templateRoot: string) {
  const ctx = createTransformContext(config)
  const spinner = new Spinner('Копирование файлов шаблона...')
  spinner.start()

  try {
    const result = await copyTemplate(templateRoot, config.targetDir, ctx, config.dryRun)
    spinner.stop(config.dryRun ? 'План копирования сформирован' : 'Файлы скопированы')
    logger.info(`  Скопировано: ${result.copied}`)
    logger.info(`  Трансформировано: ${result.transformed}`)
    logger.info(`  Пропущено: ${result.skipped}`)
  } catch (error) {
    spinner.stop()
    logger.error('Ошибка при копировании шаблона')
    if (error instanceof Error) {
      logger.error(error.message)
    }
    process.exit(1)
  }
}

/**
 * Рекурсивно копирует директорию шаблона в целевую директорию,
 * применяя трансформацию к файлам из списка TRANSFORMABLE_FILES.
 *
 * В режиме dry-run файлы не записываются; вместо этого в лог
 * выводится план действий (какие файлы будут скопированы/трансформированы).
 */
export async function copyTemplate(
  templateRoot: string,
  targetDir: string,
  ctx: TransformContext,
  dryRun = false,
): Promise<CopyResult> {
  const result: CopyResult = {
    copied: 0,
    transformed: 0,
    skipped: 0
  }

  if (!dryRun) {
    await fsp.mkdir(targetDir, { recursive: true })
  } else {
    logger.step(`[dry-run] Целевая директория: ${targetDir}`)
  }

  await walkAndCopy(templateRoot, targetDir, templateRoot, ctx, result, dryRun)

  return result
}

/**
 * Рекурсивный обход и копирование.
 *
 * @param src          - текущая исходная директория
 * @param dest         - текущая целевая директория
 * @param templateRoot - корень шаблона (для вычисления относительных путей)
 * @param ctx          - контекст
 * @param result       - результат рекурсии
 * @param dryRun       - режим dry-run
 */
async function walkAndCopy(
  src: string,
  dest: string,
  templateRoot: string,
  ctx: TransformContext,
  result: CopyResult,
  dryRun: boolean,
): Promise<void> {
  const entries = await fsp.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const relativePath = path.relative(templateRoot, srcPath)
    const normalizedRelative = relativePath.replace(/\\/g, '/')

    if (isExcluded(normalizedRelative) || isExcluded(entry.name)) {
      result.skipped++
      continue
    }

    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      if (!dryRun) {
        await fsp.mkdir(destPath, { recursive: true })
      }
      await walkAndCopy(srcPath, destPath, templateRoot, ctx, result, dryRun)
    } else if (entry.isSymbolicLink()) {
      const linkTarget = await fsp.readlink(srcPath)
      const realPath = path.resolve(src, linkTarget)
      if (fs.existsSync(realPath)) {
        await copyFile(srcPath, destPath, normalizedRelative, ctx, result, dryRun)
      } else {
        result.skipped++
      }
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath, normalizedRelative, ctx, result, dryRun)
    }
  }
}

async function copyFile(
  srcPath: string,
  destPath: string,
  relativePath: string,
  ctx: TransformContext,
  result: CopyResult,
  dryRun: boolean,
): Promise<void> {
  if (isTransformable(relativePath)) {
    const content = await fsp.readFile(srcPath, 'utf-8')
    const transformed = transformContent(content, ctx, relativePath)
    if (dryRun) {
      logger.info(`  [transform] ${relativePath}`)
    } else {
      await fsp.writeFile(destPath, transformed, 'utf-8')
    }
    result.transformed++
  } else {
    if (dryRun) {
      logger.info(`  [copy]      ${relativePath}`)
    } else {
      await fsp.copyFile(srcPath, destPath)
    }
    result.copied++
  }
}

export function createTransformContext({
  projectName, displayName, description
}: ProjectConfig): TransformContext {
  return {
    projectName,
    displayName,
    description
  }
}
