import { type CSSProperties } from 'react'

import type { EnvIssue } from '@/shared/config'

type EnvErrorScreenProps = {
  issues: EnvIssue[]
}

/**
 * Экран ошибки конфигурации: рендерится вместо приложения,
 * если при старте найдены некорректные переменные окружения.
 */
export function EnvErrorScreen({ issues }: EnvErrorScreenProps) {
  return (
    <div role="alert" style={overlayStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Ошибка конфигурации</h1>
        <p style={textStyle}>
          Миниапп не запущен из-за некорректных переменных окружения:
        </p>
        <ul style={listStyle}>
          {issues.map(issue => (
            <li key={issue.variable} style={listItemStyle}>
              <code style={codeStyle}>{issue.variable}</code>
              {' — '}
              {issue.message}
            </li>
          ))}
        </ul>
        <p style={hintStyle}>
          Скопируйте .env.example в .env, заполните корректные значения
          и перезапустите приложение.
        </p>
      </div>
    </div>
  )
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  overflowY: 'auto',
  background: 'var(--background-primary, #17181c)'
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  maxWidth: 420,
  padding: 24,
  textAlign: 'left',
  background: 'var(--background-card, #25262d)',
  borderRadius: 16
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
  textAlign: 'center',
  color: 'var(--text-primary, #fff)'
}

const textStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: 'var(--text-secondary, hsla(0, 0%, 100%, 0.8))'
}

const listStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 8
}

const listItemStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: 'var(--text-secondary, hsla(0, 0%, 100%, 0.8))'
}

const codeStyle: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 13,
  color: '#ff832a',
  wordBreak: 'break-all'
}

const hintStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  textAlign: 'center',
  color: 'var(--text-primary, #fff)'
}
