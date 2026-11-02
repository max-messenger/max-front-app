# Генерация сущности (entity) и страницы (page)

`Вызов команд возможен только в проекте при наличии подходящей структуры (src/entities, src/pages)`

Команда `generate entity/page` создаёт готовую FSD-структуру сущности или страницы по одному имени — экономит ~30 минут ручной работы при онбординге.

```bash
# В корне проекта max-front-app
node cli/dist/index.cjs generate entity Dog
node cli/dist/index.cjs generate page Dog

# Или через npx
npx @maxhub/create-max-front-app generate entity Cat
npx @maxhub/create-max-front-app generate page Cat
```

Для сущности будет создана директория `src/entities/dog/` со следующей структурой:

```
src/entities/dog/
├── index.ts                  # Публичные экспорты
├── api/
│   ├── api.ts                # API-функции (getDogsApi, getDogApi)
│   └── types.ts              # API-типы ответов
├── model/
│   ├── types.ts              # Тип сущности
│   ├── query-keys.ts         # React Query ключи
│   ├── repository.ts         # Репозиторий
│   ├── queries.ts            # React Query хуки
│   └── mock/
│       ├── index.ts          # Регистрация моков
│       └── dog.json          # Мок-данные
└── ui/
    ├── DogCard/
    │   ├── DogCard.tsx        # Карточка сущности
    │   └── DogCard.module.scss
    └── DogModal/
        ├── DogModal.tsx      # Модальное окно
        └── DogModal.module.scss
```

В случае со страницей структура выглядит проще (файл публичных экспортов, UI страницы и стили)

Также автоматически обновляются:

`src/app/mock-setup.ts` — добавляется импорт и вызов `registerDogMocks()`.
`src/app/router/AppRouter.tsx` - добавлеяется импорт страницы и роут

### Публичный API сущности

После генерации из сущности можно импортировать:

```typescript
import {
  useDogsQuery,       // React Query хук для списка
  useDogQuery,        // React Query хук для одной записи по id
  dogRepository,      // Репозиторий для прямых вызовов
  DogCard,            // UI-компонент карточки
  DogModal,           // UI-компонент модального окна
} from '@/entities/dog'
```

### Генерация страницы с использованием сущности
В случае последовательной генерации сущности и страницы с одинаковым названием скрипт предложит создать шаблонную страницу с использованием публичного API сущности

Например, при создании 
`generate entity dog` и `generate page dog` и выборе создания страницы с использованием API сущности, сгенерированная страница уже будет содержать вызов методов получения списка и экземпляра сущности, а также их рендер

Таким образом, выполнив несколько команд, вы можете получить готовые страницы с контентом, зарегистрированные в роутере.

### Имена сущностей и страниц

CLI принимает имя в любом формате и преобразует его:

| Ввод       | PascalCase | camelCase | kebab-case | Директория         |
|------------|------------|-----------|------------|--------------------|
| `Dog`      | `Dog`      | `dog`     | `dog`      | `src/entities/dog/` |
| `BigDog`   | `BigDog`   | `bigDog`  | `big-dog`  | `src/entities/big-dog/` |
| `big-dog`  | `BigDog`   | `bigDog`  | `big-dog`  | `src/entities/big-dog/` |
| `big_dog`  | `BigDog`   | `bigDog`  | `big-dog`  | `src/entities/big-dog/` |

### Опции команды `generate entity`

| Опция                  | Описание                                              |
|------------------------|-------------------------------------------------------|
| `<name>`               | Имя сущности (обязательный)                           |
| `--dry-run`            | Показать план генерации без записи файлов             |
| `--skip-mock-setup`    | Не обновлять `src/app/mock-setup.ts`                  |
| `--force`              | Перезаписать существующую сущность                    |
| `--quiet`              | Минимальный вывод                                     |

### Опции команды `generate page`

| Опция                 | Описание                                  |
|-----------------------|-------------------------------------------|
| `<name>`              | Имя страницы (обязательный)               |
| `--dry-run`           | Показать план генерации без записи файлов |
| `--skip-router`       | Не обновлять роутер                       |
| `--force`             | Перезаписать существующую сущность        |
| `--quiet`             | Минимальный вывод                         |

### Примеры

```bash
# Базовая генерация
node cli/dist/index.cjs generate entity Dog
node cli/dist/index.cjs generate page Dog

# Предпросмотр без записи
node cli/dist/index.cjs generate entity Cat --dry-run
node cli/dist/index.cjs generate page Cat --dry-run

# Перезаписать существующую сущность(страницу)
node cli/dist/index.cjs generate entity Dog --force
node cli/dist/index.cjs generate page Dog --force

# Сгенерировать без обновления mock-setup(appRouter)
node cli/dist/index.cjs generate entity User --skip-mock-setup
node cli/dist/index.cjs generate page User --skip-router

# Сложное имя
node cli/dist/index.cjs generate entity BigRedDog
# → src/entities/big-red-dog/, BigRedDogCard, useBigRedDogsQuery...
```
