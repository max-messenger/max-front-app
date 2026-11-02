import { rm, readdir, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const templateDir = path.resolve(__dirname, 'template')

/**
 * Список путей, исключаемых из шаблона.
 * Пути указаны относительно корня проекта max-front-app.
 */
const EXCLUDED = [
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
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  'pnpm-debug.log*',
  'template',
]

function isExcluded(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/')
  const parts = normalized.split('/')

  for (const excluded of EXCLUDED) {
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

async function copyDir(src, dest, base) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const relativePath = path.relative(base, srcPath)

    if (isExcluded(relativePath) || isExcluded(entry.name)) {
      continue
    }

    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, base)
    } else if (entry.isSymbolicLink()) {
      // Символьные ссылки пропускаем — в шаблоне они не нужны
      continue
    } else if (entry.isFile()) {
      await copyFile(srcPath, destPath)
    }
  }
}

async function main() {
  console.log('Подготовка шаблона проекта...')
  console.log(`  Источник:  ${projectRoot}`)
  console.log(`  Назначение: ${templateDir}`)

  await rm(templateDir, { recursive: true, force: true })
  await copyDir(projectRoot, templateDir, projectRoot)

  console.log('✓ Шаблон подготовлен в cli/template/')
}

main().catch(error => {
  console.error('Ошибка при подготовке шаблона:', error)
  process.exit(1)
})
