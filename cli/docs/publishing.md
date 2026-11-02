# Публикация

В npm публикуется только CLI-пакет `@maxhub/create-max-front-app`. Шаблон приложения (`@maxhub/max-front-app`) отдельным пакетом не публикуется: при сборке CLI его файлы копируются в `cli/template/` и уезжают внутрь npm-пакета.

## Автоматический релиз (рекомендуется)

Полный процесс — changelog, версия, git-тег, GitHub Release и публикация в npm — описан в [releasing.md](releasing.md). Команды запускаются из `cli/`:

```bash
cd cli

# Проверить, что будет выпущено
npm run release:dry

# Выпустить релиз
npm run release
```

`release` бампает версию в `cli/package.json`, генерирует `cli/CHANGELOG.md`, собирает пакет и публикует его в npm.

## Ручная публикация

Если нужно опубликовать без changelog/GitHub Release:

```bash
cd cli

# Обновите версию в package.json
npm version patch  # или minor / major

# Сборка и публикация (prepublishOnly выполнит typecheck и build автоматически)
npm publish
```

Пакет публикуется в открытый npm благодаря `publishConfig.access: "public"` в `cli/package.json`.

## Запуск через npx после публикации

После публикации CLI доступен через `npx`:

```bash
# Создание проекта в новой директории
npx @maxhub/create-max-front-app my-app

# В текущей директории
npx @maxhub/create-max-front-app .

# С указанием конкретной версии
npx @maxhub/create-max-front-app@1.3.0 my-app
```
