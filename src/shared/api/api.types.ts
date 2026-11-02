export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type ApiRequestOptions = {
  method?: ApiMethod
  body?: unknown
  headers?: Record<string, string>
  baseUrl?: string
  signal?: AbortSignal
  timeoutMs?: number
}

export type ApiRequestError = Error & {
  isApiRequestError: true
  status: number
  body: unknown
  path: string
}
