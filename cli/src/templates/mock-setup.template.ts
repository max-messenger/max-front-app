import path from 'node:path'

import { type FileSpec } from '../types'

export const buildMockSetup = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'app', 'mock-setup.ts'),
  content: `/**
 * Регистрация mock-обработчиков.
 * Добавьте сюда регистрацию своих моков.
 *
 * @example
 * import { registerMyEntityMocks } from '@/entities/my-entity/model/mock'
 * export function setupMocks(): void {
 *   registerMyEntityMocks()
 * }
 */
export function setupMocks(): void {
  // Регистрация Mock-обработчиков
}
`
})

/**
 * Возвращает строку-импорт для mock-setup.ts
 * Пример: "import { registerDogMocks } from '@/entities/dog/model/mock'"
 */
export function buildMockImport(pascalCaseName: string, kebabCaseName: string): string {
  return `import { register${pascalCaseName}Mocks } from '@/entities/${kebabCaseName}/model/mock'`
}

/**
 * Возвращает строку-вызов для mock-setup.ts
 * Пример: "  registerDogMocks()"
 */
export function buildMockCall(pascalCaseName: string): string {
  return `  register${pascalCaseName}Mocks()`
}
