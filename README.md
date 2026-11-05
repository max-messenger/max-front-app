# MAX Front App

Миниапп-шаблон для приложений внутри мессенджера MAX.
Базовая архитектура для будущих miniapp-приложений на React + Vite (Feature-Sliced Design).

## Установка шаблона через CLI

Для установки проекта можно использовать готовую утилиту
```bash
@maxhub/create-max-front-app my-new-project
```
Подробнее о CLI [здесь](./cli/docs/usage.md)

## Локальный запуск

Установить зависимости:

```bash
npm install
```

Запустить dev-сервер

```bash
npm run dev
```

Запустить dev-сервер с мок-данными (без бэкенда)

```bash
npm run dev-mock
```

Проверить типы и собрать проект

```bash
npm run build
```

Проверить форматирование ESLint

```bash
npm run lint
```

Локальный просмотр собранной сборки

```bash
npm run preview
```

Отчёт о размере бандла (интерактивный treemap в `stats.html`)

```bash
npm run analyze
```

## Переменные окружения

Локально используются переменные из файла **.env** (см. `.env.example`):

```env
VITE_API_HOST=host
VITE_BRIDGE_URL=bridge
VITE_MOCK=false
```

- `VITE_API_HOST` — адрес бэкенда, к которому ходят запросы через `apiRequest`.
- `VITE_BRIDGE_URL` — адрес скрипта WebApp Bridge (SDK MAX).
- `VITE_MOCK` — включает мок-режим (`npm run dev-mock` выставляет его автоматически).

Переменные валидируются при старте приложения (`src/shared/config/config.ts`):

- В мок-режиме (`VITE_MOCK=true`, `npm run dev-mock`) переменные не проверяются — данные приходят из локальных моков, бэкенд не используется.
- Вне мок-режима `VITE_API_HOST` и `VITE_BRIDGE_URL` обязательны.
- Пустые значения, заглушки из `.env.example` (`host`, `bridge`) и значения без схемы `http(s)://` считаются ошибкой.
- При ошибках вместо приложения рендерится экран `EnvErrorScreen` с перечнем проблемных переменных (и в DEV, и в PROD); подробности дополнительно логируются в консоль (`console.error`).

## Архитектура

Проект построен по Feature-Sliced Design.

Основная структура:

```text
src/
  app/
    providers/
    router/
    App.tsx
    main.tsx
    global.css

  entities/
    dog/
      api/
      model/
      ui/

  features/
    toggle-theme/

  pages/
    Main/

  shared/
    api/
    bridge/
    config/
    lib/
    theme/
    toast/
    ui/
```

## Слои

### app

Точка входа приложения. Содержит:

- Композицию провайдеров (`AppProviders`)
- Роутинг (`AppRouter`)
- Глобальные стили (`global.css`)

### entities

Бизнес-сущности приложения. Каждая сущность содержит:

- `api/` — API-запросы и типы сущности
- `model/` — хуки/квери/мутации, ключи запросов, моки
- `ui/` — компоненты сущности

### features

Небольшие переиспользуемые функции приложения (например, переключение темы).

### pages

Страницы приложения, собираются из сущностей, фич и shared-компонентов.

### shared

Общий слой, не зависящий от конкретных сущностей. Содержит:

- `api/` — обёртка над fetch, обработка ошибок, мок-режим
- `bridge/` — интеграция с WebApp Bridge (SDK MAX)
- `config/` — конфигурация окружения
- `lib/` — общие хелперы
- `theme/` — управление темой приложения
- `toast/` — глобальная система уведомлений
- `ui/` — переиспользуемые UI-компоненты

### WebApp Bridge

SDK WebApp загружается через:

```ts
loadBridge()
```

Доступ к уже загруженному объекту WebApp:

```ts
getBridge()
```

Провайдер и хук для использования в компонентах:

```ts
import { BridgeProvider, useBridge } from '@/shared/bridge'

const { status, webApp, initData } = useBridge()
```

⚠️ Используйте только `initData` из `WebApp`, `initDataUnsafe` — не используется для авторизации.

### API

Общий обработчик запросов лежит в

```
src/shared/api/api.ts
```

```ts
import { apiRequest } from '@/shared/api'

const dogs = await apiRequest<Dog[]>('/dogs', { method: 'GET' })
```

Особенности:

- Автоматически добавляет `Accept`/`Content-Type` заголовки.
- Опциональный `baseUrl` в `ApiRequestOptions` переопределяет хост
- При `VITE_MOCK=true` перехватывает запросы через `mock-registry` и возвращает данные из моков, не обращаясь к сети.
- При ошибке ответа выбрасывает типизированную ошибку через `createApiRequestError`.

Конкретные запросы каждой сущности лежат в её собственном `api/` (например, `src/entities/dog/api`).

### Тема

Тема вынесена в

```
src/shared/theme/
```

`AppThemeProvider` оборачивает приложение в `<MaxUI colorScheme={...}>` из `@maxhub/max-ui`, все цвета доступны через CSS-переменные MaxUI (`--text-primary`, `--background-surface-floating` и т.д.) для гибкого масштабирования и переиспользования.

Доступ к теме осуществляется через:

```ts
import { useAppTheme } from '@/shared/theme'

const { colorScheme, toggleColorScheme } = useAppTheme()
toggleColorScheme()
```

Выбранная тема сохраняется в `localStorage` и восстанавливается при следующем открытии приложения.

### Уведомления

Глобальная toast-система с поддержкой следующих вещей:

#### Типы:

```
success
error
warning
info
```

#### Позиции:

```
top
bottom
```

Провайдер подключён внутри `AppThemeProvider`, поэтому уведомления автоматически меняют цвет вместе с темой приложения. Стек уведомлений ограничен (максимум 5 одновременно видимых на позицию), поддерживает автозакрытие по таймеру, ручное закрытие и анимации появления/исчезновения.

Использование:

```ts
import { useToast } from '@/shared/toast'

const toast = useToast()

toast.show({
  type: 'error',
  placement: 'top',
  title: 'Ошибка',
  description: message,
  duration: 4000
})
```

### UI-кит

Переиспользуемые компоненты лежат в `src/shared/ui/`:

- `Modal` — модальные окна
- `FlexBox` — обёртка для флекс-раскладок
- `Page` — базовый layout страницы
- `Toast` — визуальные компоненты системы уведомлений
