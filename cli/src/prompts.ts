import path from 'node:path'
import process from 'node:process'

import prompts, { type Answers } from 'prompts'

import { logger } from './logger'
import type { ProjectConfig } from './types'

function isValidPackageName(name: string): boolean {
  return /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)
}

function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[^a-z0-9-~@]+/, '')
    .replace(/[^a-z0-9-._~@/]+/g, '-')
}

/**
 * Запускает интерактивные промпты для сбора конфигурации проекта.
 */
export async function runPrompts(targetDir: string): Promise<ProjectConfig> {
  const defaultName = path.basename(path.resolve(targetDir))

  const questions: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'projectName',
      message: 'Имя пакета (package.json name):',
      initial: toValidPackageName(defaultName),
      validate: (value: string) =>
        isValidPackageName(value)
        || 'Имя должно быть валидным npm-именем (строчные буквы, цифры, дефисы)',
    },
    {
      type: 'text',
      name: 'displayName',
      message: 'Отображаемое имя (для title в index.html):',
      initial: defaultName,
    },
    {
      type: 'text',
      name: 'description',
      message: 'Описание проекта:',
      initial: '',
    },
    {
      type: 'confirm',
      name: 'initTests',
      message: 'Настроить тестирование с помощью Vitest?',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Инициализировать git репозиторий?',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Установить зависимости (npm install)?',
      initial: true,
    },
  ]

  const onCancel = () => {
    logger.newLine()
    logger.info('Операция отменена пользователем.')
    process.exit(0)
  }

  const response = await prompts(questions, { onCancel })

  const projectName = response.projectName as string

  return {
    projectName,
    targetDir,
    displayName: response.displayName as string,
    description: response.description as string,
    initGit: response.initGit as boolean,
    installDeps: response.installDeps as boolean,
    initTests: response.initTests as boolean,
    dryRun: false
  }
}

export async function runConfirmPrompt<T extends string>(
  name: T, message: string
): Promise<Answers<T>> {
  return await prompts({
    type: 'confirm',
    name,
    message,
    initial: false,
  })
}
