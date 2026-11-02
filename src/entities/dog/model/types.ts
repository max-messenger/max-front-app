export type Dog = {
  key: string
  name: string
  description: string
  toy: string
  age: number // в месяцах
  created: string
  /** Путь до картинки (для dev-моков) */
  image?: string
}
