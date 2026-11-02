---
name: max-front-app-generate
description: Use when the user wants to create/generate a new entity (сущность) or page (страница) in a MAX front app project — e.g. "создай сущность Cat", "добавь новую сущность", "сгенерируй страницу для Dog", "create a new entity". Triggers on words like сущность, entity, "сгенерируй страницу", generate entity/page, страница.
---

# Генерация сущности и страницы

Сущности и страницы в MAX-проекте создаются **только через CLI-пакет `@maxhub/create-max-front-app`**, а не вручную.
Не создавай файлы FSD-структуры руками — используй `npx`-команды ниже.

Этот скилл рассчитан на потребителя, у которого **нет доступа к исходникам CLI** —
это может быть сторонний разработчик или даже не-разработчик. Поэтому запуск идёт
исключительно через `npx`, а не через локальный бандл.

## Команды

Запускать **из корня проекта** — генерация работает только при наличии
`src/entities` и `src/pages`. Если этих директорий нет, создай их.

```bash
# Сущность — создаёт src/entities/<kebab>/ со всей FSD-структурой
npx @maxhub/create-max-front-app generate entity <Name>

# Страница — создаёт src/pages/<kebab>/
npx @maxhub/create-max-front-app generate page <Name>
```

## Именование

CLI принимает имя в любом формате и приводит к единому виду:

| Ввод       | PascalCase | camelCase | kebab-case | Директория              |
|------------|------------|-----------|------------|-------------------------|
| `Dog`      | `Dog`      | `dog`     | `dog`      | `src/entities/dog/`     |
| `BigDog`   | `BigDog`   | `bigDog`  | `big-dog`  | `src/entities/big-dog/` |
| `big-dog`  | `BigDog`   | `bigDog`  | `big-dog`  | `src/entities/big-dog/` |

Имя передавай в **PascalCase** (`Dog`, `BigRedDog`) — так читается естественнее.

## Опции

| Опция               | Для entity | Для page | Действие                                     |
|---------------------|:----------:|:--------:|-----------------------------------------------|
| `<name>`            | ✅         | ✅       | Имя (обязательный)                            |
| `--dry-run`         | ✅         | ✅       | Показать план генерации без записи файлов     |
| `--force`           | ✅         | ✅       | Перезаписать существующую сущность/страницу    |
| `--skip-mock-setup` | ✅         | —        | Не обновлять `src/app/mock-setup.ts`          |
| `--skip-router`     | —          | ✅       | Не обновлять `src/app/router/AppRouter.tsx`   |
| `--quiet`           | ✅         | ✅       | Минимальный вывод                             |

## Что создаётся для сущности

```
src/entities/<kebab>/
├── index.ts              # публичные экспорты
├── api/
│   ├── api.ts            # API-функции (get<X>sApi, get<X>Api)
│   └── types.ts          # типы ответов
├── model/
│   ├── types.ts          # тип сущности
│   ├── query-keys.ts     # React Query ключи
│   ├── repository.ts     # репозиторий
│   ├── queries.ts        # хуки use<X>sQuery, use<X>Query
│   └── mock/
│       ├── index.ts      # register<X>Mocks()
│       └── <kebab>.json  # мок-данные
└── ui/
    ├── <Pascal>Card/     # карточка
    └── <Pascal>Modal/   # модальное окно
```

Дополнительно обновляются (если не переданы `--skip-*`):
- `src/app/mock-setup.ts` — добавляется импорт и вызов `register<X>Mocks()`,
- `src/app/router/AppRouter.tsx` — для страницы добавляется импорт и роут.

## Рекомендуемый порядок действий

1. **Предпросмотр** (всегда — увидеть план без изменений на диске):
   ```bash
   npx @maxhub/create-max-front-app generate entity Dog --dry-run
   ```
2. **Генерация сущности**:
   ```bash
   npx @maxhub/create-max-front-app generate entity Dog
   ```
3. **Генерация страницы** — если имя совпадает с сущностью, скрипт предложит
   создать страницу **с использованием публичного API сущности** (уже с вызовами
   хуков списка/детали и рендером). Соглашайся, если нужна рабочая страница «из коробки»:
   ```bash
   npx @maxhub/create-max-front-app generate page Dog
   ```
4. **Проверка**: запусти `npm run typecheck` и `npm run dev-mock` (с моками).
5. **Доработка**: сгенерированные поля типа, мок-данные и UI — шаблонные.
   После генерации отредактируй `model/types.ts`, мок-данные и UI под реальную сущность.

## Что НЕ делать

- Не создавать файлы сущности вручную — только через `npx @maxhub/create-max-front-app generate`.
- Не запускать `npx` из произвольной директории — нужен корень проекта с `src/entities` и `src/pages`.
- Не использовать локальный путь `cli/dist/index.cjs` — этот способ только для мейнтейнеров CLI с доступом к исходникам; для потребителя его нет.
- Не забывать, что `--skip-mock-setup` / `--skip-router` оставляют `mock-setup.ts` и роутер без правок — после генерации их нужно дописать вручную.
