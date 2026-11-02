import { IconButton } from '@maxhub/max-ui'

import { useAppTheme } from '@/shared/theme'

function MoonIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

export function ThemeToggleButton() {
  const {
    colorScheme, toggleColorScheme
  } = useAppTheme()

  const isDark = colorScheme === 'dark'
  const buttonLabel = isDark ? 'Включить светлую тему' : 'Включить тёмную тему'

  return (
    <IconButton
      variant="secondary"
      size="medium"
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={toggleColorScheme}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  )
}
