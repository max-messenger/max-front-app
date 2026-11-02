import type { FileSpec, Names } from '../types'
import {
  buildApi,
  buildApiTypes,
  buildCard,
  buildCardSCSS,
  buildIndexTS,
  buildMockIndexTS,
  buildMockJSON,
  buildModal,
  buildModalSCSS,
  buildModelTypes,
  buildQueries,
  buildQueryKeys,
  buildRepository
} from './entity'

/**
 * Шаблоны файлов сущности по FSD-архитектуре.
 *
 * Структура генерируемой сущности:
 *   src/entities/{kebabCase}/
 *   ├── index.ts                          # Публичные экспорты
 *   ├── api/
 *   │   ├── api.ts                        # API-функции (get{Pascal}sApi, get{Pascal}Api)
 *   │   └── types.ts                      # API-типы ответов
 *   ├── model/
 *   │   ├── types.ts                      # Тип сущности
 *   │   ├── query-keys.ts                 # React Query ключи
 *   │   ├── repository.ts                # Репозиторий
 *   │   ├── queries.ts                   # React Query хуки
 *   │   └── mock/
 *   │       ├── index.ts                  # Регистрация моков
 *   │       └── {kebabCase}.json              # Мок-данные
 *   └── ui/
 *       ├── {PascalCase}Card/
 *       │   ├── {PascalCase}Card.tsx
 *       │   └── {PascalCase}Card.module.scss
 *       └── {PascalCase}Modal/
 *           ├── {PascalCase}Modal.tsx
 *           └── {PascalCase}Modal.module.scss
 */

export function buildEntityTemplates(names: Names, entityDir: string): FileSpec[] {
  return [
    buildIndexTS(names, entityDir),
    buildApiTypes(names, entityDir),
    buildApi(names, entityDir),
    buildModelTypes(names, entityDir),
    buildQueryKeys(names, entityDir),
    buildRepository(names, entityDir),
    buildQueries(names, entityDir),
    buildMockIndexTS(names, entityDir),
    buildMockJSON(names, entityDir),
    buildCard(names, entityDir),
    buildCardSCSS(names, entityDir),
    buildModal(names, entityDir),
    buildModalSCSS(names, entityDir)
  ]
}
