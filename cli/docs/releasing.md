# Релизный процесс create-max-front-app

Этот документ описывает, как собирать changelog и выпускать новые версии пакета `@maxhub/create-max-front-app`.

Релизный конфиг живёт в `cli/` — именно этот пакет публикуется в npm. Корневой пакет `@maxhub/max-front-app` — это шаблон приложения, он **не** публикуется в npm: его файлы попадают внутрь npm-пакета CLI в директорию `template/` при сборке.

## Предварительные требования

1. **Node.js 20.19+** — release-it и плагин changelog требуют эту версию.
2. **npm-аккаунт** с правами на публикацию пакета `@maxhub/create-max-front-app`.
   Проверить авторизацию:
   ```sh
   npm whoami
   ```
   Если не авторизованы:
   ```sh
   npm login
   ```
3. **GitHub-токен** с правами `repo` для создания GitHub Release.
   Создать токен: https://github.com/settings/tokens

   Выбираем Personal access tokens (classic), прожимаем все галочки в repo (repo:status и тд). Expiration лучше выставить на 1, 2 или 3 месяца.

   Затем добавить в окружение:
   ```sh
   export GITHUB_TOKEN=ghp_ваш_токен
   ```
   (добавьте в `~/.zshrc` для постоянного использования)

4. **Рабочая ветка**: релиз выполняется только из ветки `master` с чистым git-статусом и синхронизированным upstream.

## Используемые инструменты

- [release-it](https://github.com/release-it/release-it) — оркестратор релиза
- [@release-it/conventional-changelog](https://github.com/release-it/conventional-changelog) — генерация `cli/CHANGELOG.md` на основе коммитов
- Конфигурация: `cli/.release-it.json`

## Что делает команда релиза

При запуске `npm run release` из директории `cli/` автоматически:

1. **Проверяет типы** (`npm run typecheck`) — релиз не начнётся при ошибках
2. **Определяет новую версию** на основе коммитов с прошлого тега:
   - `feat:` / `feature:` → minor (`1.3.0` → `1.4.0`)
   - `fix:` → patch (`1.3.0` → `1.3.1`)
   - `BREAKING CHANGE:` в теле коммита → major (`1.3.0` → `2.0.0`)
3. **Генерирует `cli/CHANGELOG.md`** — группирует изменения по категориям
4. **Обновляет `version`** в `cli/package.json` и `cli/package-lock.json`
5. **Собирает пакет** (`npm run build`): перегенерирует `cli/template/` из корня и собирает `cli/dist/`
6. **Создаёт git-коммит** `chore(release): vX.Y.Z`
7. **Создаёт git-тег** `vX.Y.Z`
8. **Публикует в npm** (`npm publish`) — только `@maxhub/create-max-front-app`
9. **Создаёт GitHub Release** с автогенерированными заметками
10. **Push коммита и тега** в `origin/master`

## Команды

Все команды выполняются из директории `cli/`:

```sh
cd cli
```

### Проверка (dry-run) — без реальных изменений

```sh
npm run release:dry
```

Покажет планируемую версию и превью changelog, ничего не меняя в репозитории/реестре. **Всегда запускайте сначала dry-run.**

### Полный релиз (интерактивный)

```sh
npm run release
```

На каждом шаге запрашивает подтверждение (Y/n). Можно прервать на любом этапе.

### Неинтерактивный релиз (для CI/скриптов)

```sh
npx release-it --ci
```

Запускает весь процесс без вопросов — удобно в CI.

### Релиз конкретной версии (override)

```sh
npx release-it 1.3.5
```

### Только patch/minor/major/pre-release

```sh
npx release-it patch      # 1.3.0 → 1.3.1
npx release-it minor      # 1.3.0 → 1.4.0
npx release-it major      # 1.3.0 → 2.0.0
npx release-it prepatch   # 1.3.0 → 1.3.1-0
npx release-it preminor   # 1.3.0 → 1.4.0-0
npx release-it premajor   # 1.3.0 → 2.0.0-0
```

## Требования к коммитам

Changelog строится по [Conventional Commits](https://conventionalcommits.org). Рекомендуемый формат:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Поддерживаемые типы

| Тип | Раздел в CHANGELOG | Влияние на версию |
|---|---|---|
| `feat` / `feature` | ✨ Новые возможности | minor |
| `fix` | 🐛 Исправления | patch |
| `perf` | ⚡️ Производительность | patch |
| `refactor` | ♻️ Рефакторинг | patch |
| `revert` | ⏪ Откаты изменений | patch |
| `docs` | 📚 Документация | — |
| `style` | 💎 Стили | — |
| `chore` | 🛠 Прочее | — |
| `build` | 📦 Сборка | — |
| `ci` | 👷 CI | — |

> ⚠️ Коммиты без recognized типа попадут в раздел «Прочее» и не повлияют на версию.

### Breaking change

Для мажорного бампа добавьте в тело коммита футер:
```
BREAKING CHANGE: описание того, что сломалось
```
или используйте `!` после типа/скоупа:
```
feat(api)!: переименованы пропсы Button
```

### Примеры

```
feat(ISSUE-XXX): добавлен функционал
fix(some error): исправлен баг
docs: обновлён README
chore(deps): обновлены зависимости
```

## Первичная инициализация CHANGELOG

Если `cli/CHANGELOG.md` ещё не существует, первый запуск `npm run release` создаст его с историей коммитов от предыдущего тега. Поскольку git-тегов ранее не было, первый релиз соберёт всю доступную историю — это нормально.

Чтобы создать тег для текущей версии `1.3.0` без релиза (чтобы будущие changelog начинались отсюда):

```sh
git tag -a v1.3.0 -m "Release 1.3.0"
git push origin v1.3.0
```

После этого следующий `npm run release` будет собирать changelog только от `v1.3.0`.

## Откат релиза

Если публикация прошла с ошибкой:

```sh
# Удалить git-тег
git tag -d vX.Y.Z
git push origin :refs/tags/vX.Y.Z

# Откатить коммит релиза
git reset --hard HEAD~1
git push --force-with-lease origin master

# Снять версию с npm (только в течение 72 часов, deprecated)
npm deprecate @maxhub/create-max-front-app@X.Y.Z "отозвано — используйте X.Y.W"
```

> Полностью удалить версию из npm невозможно после 72 часов — только deprecate.

## Структура конфигурации

| Файл | Назначение |
|---|---|
| `cli/.release-it.json` | Основной конфиг release-it |
| `cli/package.json` → `scripts.release` | Запуск release-it |
| `cli/package.json` → `scripts.release:dry` | Dry-run |
| `cli/package.json` → `files` | Что публикуется в npm (`dist`, `template`, `README.md`, `CHANGELOG.md`) |
| `cli/package.json` → `publishConfig.access` | `public` — пакет публикуется в открытый npm |
| `cli/CHANGELOG.md` | Генерируется автоматически |

> GitHub Release создаётся по git-remote `origin`. Если `origin` указывает не на GitHub (например, на внутренний GitLab), release-it не сможет создать GitHub Release — понадобится remote на GitHub или соответствующая настройка в `cli/.release-it.json`.

## Проверочный чек-лист перед релизом

- [ ] Авторизован в npm (`npm whoami`)
- [ ] Установлен `GITHUB_TOKEN`
- [ ] Ветка `master`, нет незакоммиченных изменений (`git status`)
- [ ] Локальный master синхронизирован с origin (`git pull`)
- [ ] `npm run release:dry` из `cli/` показывает корректную версию и changelog
- [ ] `npm run build` из `cli/` проходит без ошибок
