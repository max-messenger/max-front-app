import type { ApiMethod } from './api.types'

export type MockHandler = (ctx: { params: Record<string, string>
  body: unknown }) => unknown | null

export type MockEntry = {
  method: ApiMethod
  pattern: RegExp
  keys: string[]
  handler: MockHandler
}

const registry: MockEntry[] = []

function toRegExp(pattern: string): { re: RegExp
  keys: string[] } {
  const keys: string[] = []
  const re = new RegExp(
    `^${pattern.replace(/:([^/]+)/g, (_, key: string) => {
      keys.push(key)
      return '([^/]+)'
    })}$`
  )
  return {
    re,
    keys
  }
}

export function registerMock(method: ApiMethod, pattern: string, data: unknown): void
export function registerMock(method: ApiMethod, pattern: string, handler: MockHandler): void
export function registerMock(
  method: ApiMethod,
  pattern: string,
  dataOrHandler: unknown | MockHandler
): void {
  const {
    re, keys
  } = toRegExp(pattern)
  const handler: MockHandler
    = typeof dataOrHandler === 'function' ? (dataOrHandler as MockHandler) : () => dataOrHandler
  registry.push({
    method,
    pattern: re,
    keys,
    handler
  })
}

export function findMock(method: ApiMethod, path: string, body?: unknown): unknown | null {
  for (const entry of registry) {
    if (entry.method !== method) continue
    const match = entry.pattern.exec(path)
    if (!match) continue

    const params: Record<string, string> = {}
    entry.keys.forEach((key, i) => {
      params[key] = decodeURIComponent(match[i + 1])
    })

    return entry.handler({
      params,
      body: body ?? null
    })
  }
  return null
}

export function clearMocks(): void {
  registry.length = 0
}
