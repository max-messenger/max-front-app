export interface AppConfig {
  apiHost: string
  bridgeUrl: string
  mock?: boolean
  isDev: boolean
}

export interface EnvIssue {
  variable: string
  message: string
}

/** Заглушки из .env.example, которые нельзя использовать как реальные значения */
const PLACEHOLDER_ENV_VALUES = new Set(['host', 'bridge'])

const URL_PATTERN = /^https?:\/\//

function checkRequiredUrl(
  variable: string,
  value: string | undefined
): EnvIssue | null {
  if (value === undefined || value.trim() === '') {
    return {
      variable,
      message: 'не задана — скопируйте .env.example в .env и заполните значение'
    }
  }

  const trimmed = value.trim()

  if (PLACEHOLDER_ENV_VALUES.has(trimmed)) {
    return {
      variable,
      message: 'содержит заглушку из .env.example — замените на реальное значение'
    }
  }

  if (!URL_PATTERN.test(trimmed)) {
    return {
      variable,
      message: `должна быть URL со схемой http:// или https://, получено: "${trimmed}"`
    }
  }

  return null
}

function collectEnvIssues(
  apiHost: string | undefined,
  bridgeUrl: string | undefined
): EnvIssue[] {
  const issues: EnvIssue[] = []

  const apiIssue = checkRequiredUrl('VITE_API_HOST', apiHost)
  if (apiIssue !== null) {
    issues.push(apiIssue)
  }

  // Bridge нужен всегда — без него не работает интеграция с мессенджером
  const bridgeIssue = checkRequiredUrl('VITE_BRIDGE_URL', bridgeUrl)
  if (bridgeIssue !== null) {
    issues.push(bridgeIssue)
  }

  return issues
}

function reportEnvIssues(issues: EnvIssue[]): void {
  if (issues.length === 0) {
    return
  }

  const details = issues.map(issue => `  - ${issue.variable}: ${issue.message}`).join('\n')
  const message = [
    'Некорректные переменные окружения:',
    details,
    '',
    'Скопируйте .env.example в .env и заполните корректные значения.'
  ].join('\n')

  console.error(message)
}

const isDev = import.meta.env.DEV
const mock = import.meta.env.VITE_MOCK === 'true'

// В мок-режиме (npm run dev-mock) данные приходят из локальных моков,
// а не с бэка — переменные окружения не проверяются
export const envIssues: EnvIssue[] = mock
  ? []
  : collectEnvIssues(import.meta.env.VITE_API_HOST, import.meta.env.VITE_BRIDGE_URL)
reportEnvIssues(envIssues)

export const config: AppConfig = {
  apiHost: import.meta.env.VITE_API_HOST,
  bridgeUrl: import.meta.env.VITE_BRIDGE_URL,
  mock,
  isDev
}
