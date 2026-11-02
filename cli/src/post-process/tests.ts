import fsp from 'node:fs/promises'
import path from 'node:path'

import { updateViteConfig, writeFiles } from '@helpers'

import { logger, Spinner } from '../logger'
import { buildAgeCalculatorTest, buildSetupTests, buildThemeToggleButtonTest } from '../templates'
import { type FileSpec } from '../types'

interface PackageJson {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
  [key: string]: unknown
}
interface TSConfig {
  compilerOptions: {
    types: string[]
  }
}

const devDependencies = {
  'vitest': '4.1.11',
  'jsdom': '30.0.1',
  '@testing-library/dom': '10.4.0',
  '@testing-library/jest-dom': '7.0.1',
  '@testing-library/react': '16.3.2',
  '@testing-library/user-event': '14.6.5',
}

async function buildPackageJson(targetDir: string): Promise<FileSpec> {
  const filePath = path.join(targetDir, 'package.json')

  const pkgJsonContent = await fsp.readFile(filePath, 'utf-8')
  const pkgJson = JSON.parse(pkgJsonContent) as PackageJson
  const scripts = {
    test: 'vitest run'
  }
  Object.entries(scripts).forEach(([key, value]) => {
    pkgJson.scripts[key] = value
  })
  Object.entries(devDependencies).forEach(([key, value]) => {
    pkgJson.devDependencies[key] = value
  })
  const content = JSON.stringify(pkgJson, null, 2)

  return {
    relativePath: filePath,
    content
  }
}

async function buildTsConfig(targetDir: string): Promise<FileSpec> {
  const filePath = path.join(targetDir, 'tsconfig.app.json')
  const tsConfigContent = await fsp.readFile(filePath, 'utf-8')
  const tsConfig = JSON.parse(tsConfigContent) as TSConfig
  tsConfig.compilerOptions.types.push('vitest/globals', '@testing-library/jest-dom')
  const content = JSON.stringify(tsConfig, null, 2)

  return {
    relativePath: filePath,
    content
  }
}

/**
 * Настраивает Vitest: правит package.json/tsconfig/vite.config,
 * добавляет setup-файл и примеры тестов.
 *
 * В режиме dry-run файлы не правятся, в лог выводится план.
 */
export async function initTests(targetDir: string, dryRun = false, skipExamples = false) {
  const spinner = new Spinner(dryRun ? '[dry-run] Конфигурация Vitest...' : 'Конфигурация Vitest...')
  spinner.start()
  const setupFilePath = path.join('src', 'shared', 'config', 'setup-tests.ts')

  if (dryRun) {
    logger.info('  [edit]   package.json (+test script, +devDependencies)')
    logger.info('  [edit]   tsconfig.app.json (+types)')
    logger.info('  [edit]   vite.config.ts (+test config)')
    logger.info(`  [write]  ${setupFilePath}`)
    if (!skipExamples) {
      logger.info('  [write]  src/shared/lib/age-calculator.test.ts')
      logger.info('  [write]  src/features/toggle-theme/ThemeToggleButton.test.tsx')
    }
  } else {
    try {
      const packageJson = await buildPackageJson(targetDir)
      const tsConfig = await buildTsConfig(targetDir)
      const viteConfig = await updateViteConfig(targetDir, setupFilePath)
      const examples = skipExamples
        ? []
        : [
          buildAgeCalculatorTest(targetDir),
          buildThemeToggleButtonTest(targetDir),
        ]
      await writeFiles([
        packageJson,
        tsConfig,
        viteConfig,
        buildSetupTests(targetDir, setupFilePath),
        ...examples
      ], targetDir)
    } catch (error) {
      logger.error('Ошибка настройки тестов')
      if (error instanceof Error) {
        logger.error(error.message)
      }
    }
  }
  spinner.stop(dryRun ? '[dry-run] План настройки тестов сформирован' : 'Тесты настроены')
}
