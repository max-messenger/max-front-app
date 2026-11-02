import { config } from '@/shared/config'

import { API_ERROR_MESSAGES, API_HEADERS, API_REQUEST_TIMEOUT_MS } from './api.constants'
import type { ApiRequestOptions } from './api.types'
import { createApiRequestError, getApiErrorMessage } from './api-error'
import { findMock } from './mock-registry'

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (response.status === 204) {
    return null
  }

  if (contentType.includes('application/json')) {
    const json: unknown = await response.json().catch(() => null)
    return json
  }

  return response.text().catch(() => null)
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const effectiveBaseUrl = options.baseUrl ?? config.apiHost

  if (effectiveBaseUrl === config.apiHost && config.mock) {
    const mock = findMock(options.method ?? 'POST', path, options.body)
    if (mock !== null) {
      return mock as T
    }
  }

  const hasBody = options.body !== undefined

  const headers: Record<string, string> = {
    Accept: API_HEADERS.accept,
    ...options.headers
  }

  if (hasBody) {
    headers['Content-Type'] = API_HEADERS.contentType
  }

  const timeoutMs = options.timeoutMs ?? API_REQUEST_TIMEOUT_MS
  const controller = new AbortController()
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  const externalSignal = options.signal
  let onExternalAbort: (() => void) | undefined

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort()
    } else {
      onExternalAbort = () => controller.abort()
      externalSignal.addEventListener('abort', onExternalAbort, { once: true })
    }
  }

  try {
    const response = await fetch(`${effectiveBaseUrl}${path}`, {
      method: options.method ?? 'POST',
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })

    const responseBody = await parseResponseBody(response)

    if (!response.ok) {
      throw createApiRequestError({
        message: getApiErrorMessage(
          responseBody,
          `${API_ERROR_MESSAGES.requestFailed} ${response.status}`
        ),
        status: response.status,
        body: responseBody,
        path
      })
    }

    return responseBody as T
  } catch (error) {
    if (timedOut) {
      throw createApiRequestError({
        message: API_ERROR_MESSAGES.timeout,
        status: 408,
        body: null,
        path
      })
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
    if (onExternalAbort && externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort)
    }
  }
}
