import '@maxhub/max-ui/dist/styles.css'
import './global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { config, envIssues } from '@/shared/config'

import App from './App'
import { EnvErrorScreen } from './EnvErrorScreen'
import { ErrorBoundary } from './ErrorBoundary'
import { setupMocks } from './mock-setup'
import { AppProviders } from './providers'

if (envIssues.length > 0) {
  // Некорректные переменные окружения: рендерим информативный экран вместо приложения
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <EnvErrorScreen issues={envIssues} />
    </StrictMode>
  )
} else {
  if (config.mock) {
    setupMocks()
  }
  // Используем напрямую meta.env чтобы вырезать динамический импорт из бандла
  if (import.meta.env.DEV) {
    import('eruda').then(eruda => eruda.default.init())
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </ErrorBoundary>
    </StrictMode>
  )
}
