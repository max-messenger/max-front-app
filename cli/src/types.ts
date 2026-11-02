export interface ProjectConfig {
  /** Имя нового проекта (для package.json и директории) */
  projectName: string
  /** Директория, куда будет создан проект */
  targetDir: string
  /** Имя для display в package.json */
  displayName: string
  /** Описание проекта */
  description: string
  /** Инициализировать ли git репозиторий */
  initGit: boolean
  /** Установить ли зависимости после создания */
  installDeps: boolean
  /** Настроить ли тесты */
  initTests: boolean
  /** Режим dry-run: показать план действий без записи файлов и выполнения команд */
  dryRun: boolean
}

export interface TransformContext {
  projectName: string
  displayName: string
  description: string
}

interface CommonOptions {
  dryRun?: boolean
  quiet?: boolean
}
export interface CliOptions extends CommonOptions {
  template?: string
  skipPrompts?: boolean
  git?: boolean
  install?: boolean

}

export interface GenerateEntityOptions extends CommonOptions {
  skipMockSetup?: boolean
  force?: boolean
}
export interface GeneratePageOptions extends CommonOptions {
  force?: boolean
  skipRouter?: boolean
}
export interface SetupTestsOptions extends CommonOptions {
  skipExamples?: boolean
}

export interface Names {
  /** Имя сущности как передал пользователь (например, "Dog") */
  raw: string
  /** "Dog" — для типов, компонентов */
  PascalCase: string
  /** "dog" — для переменных, функций */
  camelCase: string
  /** "dog" — для директорий, API-путей */
  kebabCase: string
  /** "DOGS" — для констант */
  upperSnake: string
}

export interface FileSpec {
  /** Относительный путь */
  relativePath: string
  /** Содержимое файла */
  content: string
}
