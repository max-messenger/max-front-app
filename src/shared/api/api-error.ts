import type { ApiRequestError } from './api.types'

type CreateApiRequestErrorParams = {
  message: string
  status: number
  body: unknown
  path: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object'
}

export function getApiErrorMessage(body: unknown, fallback: string) {
  if (typeof body === 'string' && body.trim()) {
    return body
  }

  if (isRecord(body)) {
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message
    }

    if (typeof body.error === 'string' && body.error.trim()) {
      return body.error
    }
  }

  return fallback
}

export function createApiRequestError({
  message,
  status,
  body,
  path
}: CreateApiRequestErrorParams) {
  return Object.assign(new Error(message), {
    name: 'ApiRequestError',
    isApiRequestError: true,
    status,
    body,
    path
  } as ApiRequestError)
}
