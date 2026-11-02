import path from 'node:path'

import { type FileSpec } from '../types'

export const buildAgeCalculatorTest = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'shared', 'lib', 'age-calculator.test.ts'),
  content: `import { describe, expect, it } from 'vitest'

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

    it('3 года', () => {
      expect(getAge(36)).toBe('3 года 0 мес')
    })

    it('4 года', () => {
      expect(getAge(48)).toBe('4 года 0 мес')
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
`
})
