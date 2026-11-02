import { type FileSpec, type Names } from '../types'
import { buildIndexTS, buildPageEmpty, buildPageSCSS, buildPageWithEntity } from './page'

/**
 * Шаблоны файлов страницы.
 *
 * Структура генерируемой страницы:
 *   src/pages/{PascalCase}/
 *   ├── index.ts                          # Публичные экспорты
 *   ├── {PascalCase}.tsx                  # UI-компонент страницы
 *   └── {PascalCase}.module.scss          # Стили для страницы
 *
 *   Генерируется пустая страница или страница
 *   с используем publicApi сущности в зависимости от переданного entityName
 */
export function buildPageTemplates(names: Names, pageDir: string, entityName: string = ''): FileSpec[] {
  return [
    buildIndexTS(names, pageDir),
    entityName ? buildPageWithEntity(names, pageDir, entityName) : buildPageEmpty(names, pageDir),
    buildPageSCSS(names, pageDir),
  ]
}

/**
 * Возвращает строку-импорт для AppRouter.tsx.
 * Пример: "import { UsersPage } from '@/pages/Users'"
 */
export function buildPageImport(pascalCaseName: string): string {
  return `import { ${pascalCaseName}Page } from '@/pages/${pascalCaseName}'`
}

/**
 * Возвращает строку-роут для AppRouter.tsx.
 * Пример: "        <Route path=\"/users\" element={<UsersPage />} />"
 */
export function buildPageRoute(kebabCaseName: string, pascalCaseName: string): string {
  return `        <Route path="/${kebabCaseName}" element={<${pascalCaseName}Page />} />`
}
