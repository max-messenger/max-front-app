import fs from 'node:fs'
import path from 'node:path'

/**
 * Директории и файлы, которые не нужно копировать в новый проект.
 * Пути указаны относительно корня шаблона.
 */
export const EXCLUDED_PATHS = [
  'node_modules',
  'dist',
  'dist-ssr',
  '.git',
  '.idea',
  '.vscode',
  '.DS_Store',
  '.env',
  '.env.local',
  '.env.*.local',
  'package-lock.json',
  'cli',
  'coverage',
  '.husky/_',
  '*.log',
  'stats.html',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  'pnpm-debug.log*',
  '.gitignore',
  'LICENSE'
]

/**
 * Файлы, в которых нужно выполнять подстановку переменных шаблона.
 * Пути указаны относительно корня шаблона.
 */
export const TRANSFORMABLE_FILES = [
  'package.json',
  'index.html',
  '.env.example',
  'README.md',
]

/**
 * Директории и файлы примеров, которые удаляются при выборе опции cleanExamples.
 * Пути указаны относительно корня нового проекта.
 */
export const EXAMPLE_PATHS = [
  'src/entities/dog',
  'public/dogs',
  'src/pages/Main/Main.tsx',
  'src/pages/Main/Main.module.scss',
  'src/pages/Main/index.ts',
]

/**
 * Проверяет, должен ли путь быть исключённым из копирования.
 */
export function isExcluded(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/')
  const parts = normalized.split('/')

  for (const excluded of EXCLUDED_PATHS) {
    if (excluded.includes('/')) {
      if (normalized === excluded || normalized.startsWith(excluded + '/')) {
        return true
      }
      continue
    }

    if (parts.includes(excluded)) {
      return true
    }

    if (excluded.includes('*')) {
      const regex = new RegExp(`^${excluded.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`)
      if (parts.some(part => regex.test(part))) {
        return true
      }
    }
  }

  return false
}

export function isTransformable(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/')
  return TRANSFORMABLE_FILES.includes(normalized)
}

/**
 * Возвращает путь к шаблону проекта max-front-app.
 *
 * По умолчанию шаблон встроен в npm-пакет в директорию `template/`
 * (рядом с собранным `dist/index.cjs`). При локальной разработке
 * можно переопределить через переменную окружения MAX_TEMPLATE_ROOT.
 */
export function getTemplateRoot(): string {
  const fromEnv = process.env.MAX_TEMPLATE_ROOT
  if (fromEnv) {
    return path.resolve(fromEnv)
  }

  // process.argv[1] — путь к запускаемому скрипту (dist/index.cjs или src/index.ts)
  // При запуске через npx/npm create этот путь указывает на симлинк в
  // node_modules/.bin/, поэтому разрешаем реальный путь через realpath.
  // Шаблон лежит в ../template относительно dist/
  const scriptPath = fs.realpathSync(process.argv[1])
  const currentDir = path.dirname(scriptPath)
  return path.resolve(currentDir, '..', 'template')
}
