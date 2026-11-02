# Архитектура CLI

```
cli/
├── package.json          # Зависимости CLI
├── tsconfig.json         # Конфиг TypeScript для CLI
├── build.mjs             # Скрипт сборки бандла (esbuild)
├── README.md             # Этот файл
├── dist/
│   └── index.cjs         # Собранный бандл (все зависимости встроены, коммитится в git)
├── template/             # Копия шаблона MAX
└── src/
    ├── index.ts          # Точка входа (commander CLI)
    ├── app.ts            # Основная функция создания проекта по шаблону
    ├── types.ts          # TypeScript-типы (ProjectConfig, TransformContext)
    ├── constants.ts      # Списки исключений, трансформируемых файлов
    ├── logger.ts         # Цветной логгер + спиннер
    ├── prompts.ts        # Интерактивные промпты (prompts)
    ├── transformer.ts    # Логика подстановки переменных
    ├── copy.ts           # Рекурсивное копирование шаблона
    ├── generate/         # Генерация сущностей (FSD)
    │   └── entity.ts          # Оркестратор генерации сущности
    └── post-process/     # Git init, Vitest, npm install, README gen, clean examples
    └── templates/        # Шаблоны для генерации файлов
    └── helpers/          # Утилиты и вспомогательные функции
```
