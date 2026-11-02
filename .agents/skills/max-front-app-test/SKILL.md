---
name: max-front-app-test
description: Use when the user wants to write/add tests in a MAX front app project — e.g. "напиши тесты", "покрой тестами", "добавь тесты для DogCard", "покрытие кода", "пограничные кейсы", "unit-тесты", "test the repository". Triggers on words like тест, тесты, vitest, coverage, покрытие, "напиши тест", "покрой".
---

# Написание тестов (Vitest)

Тесты в MAX-проекте пишутся на **Vitest** + **@testing-library/react** + **jest-dom**.
Настройка (конфиг, setup-файл, скрипты) уже приезжает при генерации
проекта — **не настраивай Vitest заново и не ставь зависимости вручную**. Этот скилл
про паттерны и конвенции написания самих тестов, а не про bootstrap.

Если в проекте не настроен **Vitest**, отсутствует **setup-tests.ts** и нет скрипта **test**, не генерируй ничего вручную, используй команду **npx @maxhub/create-max-front-app setup-tests** из корня проекта. Эта команда добавит нужные файлы и настройки и сгенерирует два файла с тестами для примера.

## Главные принципы

1. **Логика — в первую очередь, вёрстка — во вторую.** Сначала покрывай чистые
   функции, репозитории, хуки, ветвления и побочные эффекты. Вёрстку (рендер
   разметки, наличие узлов) тестируй, только когда она несёт поведенческий смысл
   (aria-label, disabled-состояние, доступность) — не ради «тест на то, что
   div отрендерился».
2. **Высокий процент покрытия — цель, а не формальность.** Стремимся покрыть
   все ветви логики, а не просто строки. Порога coverage в конфиге нет, поэтому
   ориентируйся на смысл: каждая ветка `if`, каждый вариант `return`, каждая
   ошибка должны иметь свой тест.
3. **Пограничные кейсы — обязательно.** Это не «дополнение», это ядро тест-сьютa.
   Пустые значения, нули, `NaN`, `undefined`, границы диапазонов, особые случаи
   склонения/округления, светлая/тёмная тема, пустой список, ошибка сети. См.
   [чек-лист](#чек-лист-пограничных-кейсов) ниже.
4. **Тестируй поведение, а не имплементацию.** Не привязывайся к внутренним
   переменным или приватным функциям — проверяй публичный контракт функции/хука/
   компонента через его входы и выходы. Тогда тесты не ломаются от рефактора.

## Расположение и именование

- **Co-located:** тест лежит **рядом** с тестируемым файлом, в той же директории.
- Имя файла = `<имя-файла>.test.ts` (логика) или `<имя-файла>.test.tsx` (JSX/
  компоненты). Например: `age-calculator.test.ts` рядом с `age-calculator.ts`,
  `DogCard.test.tsx` рядом с `DogCard.tsx`.
- Не создавай отдельную `__tests__/` папку и не складывай тесты в один общий
  каталог — это ломает FSD-локальность.
- Один тестируемый файл → один тест-файл. Не нывай: длина тест-файла — это
  нормально, группируй через вложенные `describe`.

## Импорты

Из Vitest бери только то, что используешь:

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest'
```

Из RTL — `render`, `screen`, при необходимости `within`, `waitFor`:

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

Импорты тестируемого кода — **относительные** (`./age-calculator`, `./DogCard`),
импорты сущностей/общего — через `@/*` alias, как и в продакшен-коде. Соблюдай
правила сортировки импортов (simple-import-sort) и semicolon-free — ESLint
гоняет и тесты тоже. Перед коммитом: `npm run lint:fix`.

## Эталонные паттерны

Ниже — два шаблона из CLI, на которые надо ориентироваться как на образец.

### Паттерн A — чистая функция (`shared/lib`)

Покрывает логику без моков и без рендера. Вложенные `describe` группируют по
смысловым категориям; внутри — по одному `it` на кейс. Пограничные значения
перебираются **полностью** (все варианты склонения, а не пара примеров).

```ts
import { describe, expect, it } from 'vitest'

import { getAge } from './age-calculator'

describe('getAge', () => {
  describe('когда возраст меньше года (years === 0)', () => {
    it('возвращает только месяцы для 0 месяцев', () => {
      expect(getAge(0)).toBe('0 мес')
    })

    it('возвращает только месяцы для 11 месяцев', () => {
      expect(getAge(11)).toBe('11 мес')
    })
  })

  describe('склонение слова "год/года/лет"', () => {
    it('1 год', () => {
      expect(getAge(12)).toBe('1 год 0 мес')
    })

    it('21 год', () => {
      expect(getAge(252)).toBe('21 год 0 мес')
    })

    it('2 года', () => {
      expect(getAge(24)).toBe('2 года 0 мес')
    })

    it('22 года', () => {
      expect(getAge(264)).toBe('22 года 0 мес')
    })

    it('5 лет', () => {
      expect(getAge(60)).toBe('5 лет 0 мес')
    })

    it('11 лет', () => {
      expect(getAge(132)).toBe('11 лет 0 мес')
    })

    it('12 лет', () => {
      expect(getAge(144)).toBe('12 лет 0 мес')
    })

    it('20 лет', () => {
      expect(getAge(240)).toBe('20 лет 0 мес')
    })
  })

  describe('комбинация лет и месяцев', () => {
    it('1 год 6 мес', () => {
      expect(getAge(18)).toBe('1 год 6 мес')
    })

    it('2 года 3 мес', () => {
      expect(getAge(27)).toBe('2 года 3 мес')
    })
  })
})
```

Применительно к этому проекту — так же тестируются все чистые функции из
`src/shared/lib`: `classNames`, `formatDate`, `use-debounced-value`,
`use-focus-trap`, `use-body-scroll-lock` (для хуков — через `renderHook`).

### Паттерн B — компонент (`features/` / `entities/ui` / `widgets`)

Поведение в первую очередь (клик → вызов колбэка), вёрстка — только когда она
несёт смысл (доступность: `toHaveAccessibleName`). Зависимости мокаются через
`vi.mock` + `vi.mocked`, состояние сбрасывается в `beforeEach`, взаимодействие
через `userEvent.setup()` (не `fireEvent`).

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ThemeToggleButton } from './ThemeToggleButton'

vi.mock('@/shared/theme', () => ({
  useAppTheme: vi.fn()
}))

const { useAppTheme } = await import('@/shared/theme')

const toggleColorScheme = vi.fn()

function setupMock(colorScheme: 'light' | 'dark') {
  vi.mocked(useAppTheme).mockReturnValue({
    colorScheme,
    toggleColorScheme
  })
}

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    toggleColorScheme.mockReset()
  })

  it('вызывает toggleColorScheme при клике (тёмная тема)', async () => {
    setupMock('dark')
    const user = userEvent.setup()

    render(<ThemeToggleButton />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(toggleColorScheme).toHaveBeenCalledTimes(1)
  })

  it('вызывает toggleColorScheme при клике (светлая тема)', async () => {
    setupMock('light')
    const user = userEvent.setup()

    render(<ThemeToggleButton />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(toggleColorScheme).toHaveBeenCalledTimes(1)
  })

  it('отображает корректный aria-label для тёмной темы', () => {
    setupMock('dark')

    render(<ThemeToggleButton />)

    expect(screen.getByRole('button')).toHaveAccessibleName('Включить светлую тему')
  })

  it('отображает корректный aria-label для светлой темы', () => {
    setupMock('light')

    render(<ThemeToggleButton />)

    expect(screen.getByRole('button')).toHaveAccessibleName('Включить тёмную тему')
  })
})
```

Заметь: обе темы (`light` и `dark`) — это пограничная пара, и обе покрыты.

## Паттерны по FSD-слоям

| Слой / артефакт           | Что тестировать                                           | Как                                                                            |
|---------------------------|------------------------------------------------------------|--------------------------------------------------------------------------------|
| `shared/lib/*`            | Чистые функции и хуки                                      | Паттерн A. Хуки — `renderHook` из `@testing-library/react`.                     |
| `shared/api/api-error.ts` | `getApiErrorMessage`, `createApiRequestError`              | Чистые функции; проверяй все формы `body` (строка, объект, пустота).           |
| `shared/api/mock-registry`| `registerMock` / `findMock` / `clearMocks`                 | Вызывай `clearMocks()` в `beforeEach`, проверяй матч по method+pattern+params. |
| `entities/<x>/api`        | API-функции (`getDogsApi`, `getDogApi`)                    | Мокай `apiRequest` из `@/shared/api` (не `fetch` напрямую). См. ниже.           |
| `entities/<x>/model/repository` | Репозиторий — что он прокидывает signal/args в api     | Мокай API-функции модуля, проверяй аргументы вызова.                           |
| `entities/<x>/model/queries` | Хуки `useDogsQuery` / `useDogQuery` (React Query)       | `renderHook` + обёртка `QueryClientProvider` с новым `QueryClient`.            |
| `entities/<x>/model/query-keys` | Структуру ключей                                      | Простой unit: `dogQueryKeys.list()` возвращает ожидаемый массив.                |
| `entities/<x>/ui/*`      | Компоненты — поведение + осмысленную доступность          | Паттерн B. Мокай hooks репозитория, не API-слой.                               |
| `features/*`              | Как widgets/ui, но проще — обычно один компонент-фича     | Паттерн B.                                                                       |
| `pages/*`                 | Минимально — интеграционный рендер без падения            | Только если есть нетривиальная логика страницы; иначе пропусти.                |

### Тест API-функций (мок `apiRequest`)

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { apiRequest } from '@/shared/api'
import { getDogApi, getDogsApi } from './api'

vi.mock('@/shared/api', () => ({
  apiRequest: vi.fn()
}))

const { apiRequest: apiRequestMock } = await import('@/shared/api')

beforeEach(() => vi.mocked(apiRequestMock).mockReset())

describe('getDogsApi', () => {
  it('возвращает data из ответа', async () => {
    vi.mocked(apiRequestMock).mockResolvedValue({ data: [{ key: 'rex' }] })
    expect(await getDogsApi()).toEqual([{ key: 'rex' }])
    expect(apiRequestMock).toHaveBeenCalledWith('/v1/dogs', expect.objectContaining({ method: 'GET' }))
  })

  it('прокидывает signal в запрос', async () => {
    vi.mocked(apiRequestMock).mockResolvedValue({ data: [] })
    const controller = new AbortController()
    await getDogsApi(controller.signal)
    expect(apiRequestMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ signal: controller.signal }))
  })

  it('пробрасывает ошибку apiRequest', async () => {
    vi.mocked(apiRequestMock).mockRejectedValue(new Error('boom'))
    await expect(getDogsApi()).rejects.toThrow('boom')
  })
})
```

### Тест React Query хуков (`renderHook`)

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useDogsQuery } from './queries'
import { dogRepository } from './repository'

vi.mock('./repository', () => ({
  dogRepository: { getDogs: vi.fn(), getDog: vi.fn() }
}))

const { dogRepository: repo } = await import('./repository')

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useDogsQuery', () => {
  it('возвращает данные при успехе', async () => {
    vi.mocked(repo.getDogs).mockResolvedValue([{ key: 'rex' }])
    const { result } = renderHook(() => useDogsQuery(), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual([{ key: 'rex' }]))
  })

  it('пробрасывает ошибку при отказе репозитория', async () => {
    vi.mocked(repo.getDogs).mockRejectedValue(new Error('network'))
    const { result } = renderHook(() => useDogsQuery(), { wrapper })
    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error))
  })
})
```

## Чек-лист пограничных кейсов

Прогоняй его для **каждой** функции/компонента, прежде чем закрыть тест-файл:

- **Пусто и нули:** `''`, `0`, `null`, `undefined`, `[]`, `{}`, `NaN`.
- **Границы диапазона:** минимум, максимум, «на единицу меньше/больше границы».
  Для индексов — `-1`, `0`, `length-1`, `length`.
- **Парные состояния:** светлая/тёмная тема, вкл/выкл, `disabled`/`enabled`,
  `loading`/`loaded`, пустой/непустой список, есть `image` / нет `image`.
- **Формы входных данных:** строка-число, объект с `message`, объект с `error`,
  пустое тело, некорректная дата (`formatDate` возвращает исходное значение).
- **Склонения/локализация:** перебери **все** варианты правил (1/21/год,
  2–4/22–24/года, 5–20/лет) — не бери по одному примеру из группы.
- **Ошибки и прерывания:** `AbortSignal` уже aborted, таймаут, `fetch` reject,
  не-OK статус ответа → `ApiRequestError` с корректным `status`/`message`.
- **Побочные эффекты:** вызывался ли колбэк, сколько раз, с какими аргументами;
  не вызывался ли при `disabled`/`loading`.

## Что НЕ делать

- **Не настраивай Vitest руками** и не добавляй dev-зависимости — конфиг и setup
  приезжают из CLI-шаблона. Если их нет — вызови `npx @maxhub/create-max-front-app setup-tests` из корня проекта.
- **Не тестируй ради вёрстки.** «Проверить, что отрендерился заголовок» —
  бесполезный тест. Тестируй aria-имя, disabled, видимость состояния, реакцию
  на клик — то, что несёт поведение или доступность.
- **Не используй `fireEvent`** для пользовательского ввода — только
  `userEvent.setup()`. `fireEvent` оставляй для случаев, которых нет в
  `userEvent` (редко).
- **Не мокай `fetch` напрямую** в тестах сущностей — мокай `apiRequest` из
  `@/shared/api`, чтобы держать контракт слоя. Прямой мок `fetch` — только для
  тестов самого `shared/api`.
- **Не пиши один гигантский `it` на всё.** Один кейс = один `it`; группируй
  через вложенные `describe`.
- **Не оставляй моки не сброшенными.** В `beforeEach` делай `mockReset()` для
  общих моков — иначе тесты утекают состояние друг в друга.
- **Не клади тесты в `__tests__/`** или общий `test/` каталог — только co-located
  `*.test.ts(x)` рядом с тестируемым файлом.
- **Не игнорируй правила ESLint в тестах.** `npm run lint:fix` прогоняется и по
  `*.test.*` — semicolon-free, сортировка импортов, без `any`.
