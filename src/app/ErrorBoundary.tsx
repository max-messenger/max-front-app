import { Component, type CSSProperties, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { children, fallback } = this.props

    if (!this.state.hasError) {
      return children
    }

    if (fallback) {
      return fallback
    }

    return (
      <div role="alert" style={overlayStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Что-то пошло не так</h1>
          <p style={textStyle}>
            Произошла непредвиденная ошибка. Перезагрузите страницу, чтобы продолжить.
          </p>
          <button type="button" onClick={this.handleReload} style={buttonStyle}>
            Перезагрузить
          </button>
        </div>
      </div>
    )
  }
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  background: 'var(--background-primary, #17181c)'
}

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  maxWidth: 360,
  padding: 24,
  textAlign: 'center',
  background: 'var(--background-card, #25262d)',
  borderRadius: 16
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
  color: 'var(--text-primary, #fff)'
}

const textStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  color: 'var(--text-secondary, hsla(0, 0%, 100%, 0.8))'
}

const buttonStyle: CSSProperties = {
  marginTop: 4,
  padding: '8px 16px',
  border: 'none',
  borderRadius: 8,
  background: 'var(--icon-themed, #007aff)',
  color: 'var(--text-primary-inverse, #fff)',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer'
}
