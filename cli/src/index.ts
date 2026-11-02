import process from 'node:process'

import { generateEntity } from '@generate/entity'
import { generatePage } from '@generate/page'
import { Command } from 'commander'

import pkg from '../package.json' with { type: 'json' }
import { app } from './app'
import { setupTests } from './setup-tests'
import { type CliOptions, type GenerateEntityOptions, type GeneratePageOptions, type SetupTestsOptions } from './types'

const program = new Command()

program
  .name('create-max-front-app')
  .description('CLI для создания нового проекта на базе max-front-app')
  .version(pkg.version)
  .argument('[project-name]', 'Имя директории нового проекта')
  .option('--template <path>', 'Путь к шаблону проекта (по умолчанию — max-front-app)')
  .option('--skip-prompts', 'Пропустить интерактивные промпты (использовать значения по умолчанию)')
  .option('--no-git', 'Не инициализировать git')
  .option('--no-install', 'Не устанавливать зависимости')
  .option('--dry-run', 'Показать план действий без записи файлов и выполнения команд')
  .option('--quiet', 'Минимальный вывод (только ошибки и итог)')
  .action(async (projectName: string | undefined, options: CliOptions) => {
    await app(projectName, options)
  })

// ── Subcommand: generate entity ──────────────────────────────
const generateCmd = new Command('generate')
  .description('Генерация кода по FSD-структуре')

const entityCmd = new Command('entity')
  .description('Сгенерировать сущность (entity) по FSD: api, model, ui, mock')
  .argument('<name>', 'Имя сущности (например: user, product, big-dog)')
  .option('--dry-run', 'Показать план генерации без записи файлов')
  .option('--skip-mock-setup', 'Не обновлять src/app/mock-setup.ts')
  .option('--force', 'Перезаписать существующую сущность')
  .option('--quiet', 'Минимальный вывод (только ошибки и итог)')
  .action(async (name: string, options: GenerateEntityOptions) => {
    const programOpts = program.opts<CliOptions>()
    await generateEntity(name, process.cwd(), {
      ...options,
      dryRun: options.dryRun ?? programOpts.dryRun,
      quiet: options.quiet ?? programOpts.quiet,
    })
  })

const pageCmd = new Command('page')
  .description('Сгенерировать страницу (page)')
  .argument('<name>', 'Имя страницы (например: Users, Products)')
  .option('--dry-run', 'Показать план генерации без записи файлов')
  .option('--force', 'Перезаписать существующую страницу')
  .option('--skip-router', 'Не обновлять src/app/router/AppRouter.tsx')
  .option('--quiet', 'Минимальный вывод (только ошибки и итог)')
  .action(async (name: string, options: GeneratePageOptions) => {
    const programOpts = program.opts<CliOptions>()
    await generatePage(name, process.cwd(), {
      ...options,
      dryRun: options.dryRun ?? programOpts.dryRun,
      quiet: options.quiet ?? programOpts.quiet,
    })
  })

const setupTestsCmd = new Command('setup-tests')
  .description('Настроить bootstrap Vitest')
  .option('--skip-examples', 'Не добавлять примеры')
  .option('--dry-run', 'Показать план генерации без записи файлов')
  .option('--quiet', 'Минимальный вывод (только ошибки и итог)')
  .action(async (options: SetupTestsOptions) => {
    const programOpts = program.opts<CliOptions>()
    await setupTests(process.cwd(), {
      ...options,
      dryRun: options.dryRun ?? programOpts.dryRun,
    })
  })

generateCmd.addCommand(entityCmd)
generateCmd.addCommand(pageCmd)
program.addCommand(generateCmd)
program.addCommand(setupTestsCmd)

program.parse(process.argv)
