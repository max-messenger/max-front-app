import path from 'node:path'

import { type FileSpec } from '../types'

export const buildThemeToggleButtonTest = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'features', 'toggle-theme', 'ThemeToggleButton.test.tsx'),
  content: `import { render, screen } from '@testing-library/react'
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
`
})
