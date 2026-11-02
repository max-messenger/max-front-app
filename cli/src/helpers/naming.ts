/**
 * Утилиты для преобразования имён сущности в разные регистры.
 *
 * Пример: "Dog" →
 *   PascalCase:  Dog
 *   camelCase:   dog
 *   kebab-case:  dog
 *
 * Пример: "BigDog" →
 *   PascalCase:  BigDog
 *   camelCase:   bigDog
 *   kebab-case:  big-dog
 *
 * Пример: "big-dog" →
 *   PascalCase:  BigDog
 *   camelCase:   bigDog
 *   kebab-case:  big-dog
 */

import { type Names } from '../types'

/**
 * Разбивает строку на слова.
 * Поддерживает: PascalCase, camelCase, kebab-case, snake_case, пробелы.
 */
function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → "camel Case"
    .replace(/[-_]/g, ' ') // kebab/snake → spaces
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * "Dog", "BigDog" — для имён типов и компонентов.
 */
function toPascalCase(input: string): string {
  const words = splitWords(input)
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}

/**
 * "dog", "bigDog" — для имён переменных и функций.
 */
function toCamelCase(input: string): string {
  const pascal = toPascalCase(input)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/**
 * "dog", "big-dog" — для имён директорий и API-путей.
 */
function toKebabCase(input: string): string {
  return splitWords(input)
    .map(w => w.toLowerCase())
    .join('-')
}

/**
 * "DOGS", "BIG_DOGS" — для имён констант.
 */
function toUpperSnakeCase(input: string): string {
  return splitWords(input)
    .map(w => w.toUpperCase())
    .join('_')
}

export function resolveEntityNames(rawName: string): Names {
  return {
    raw: rawName,
    PascalCase: toPascalCase(rawName),
    camelCase: toCamelCase(rawName),
    kebabCase: toKebabCase(rawName),
    upperSnake: toUpperSnakeCase(rawName),
  }
}
