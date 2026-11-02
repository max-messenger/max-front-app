import type { TransformContext } from './types'

/**
 * Плейсхолдеры, которые заменяются в файлах шаблона.
 * Используем формат __PLACEHOLDER__ чтобы избежать конфликтов с реальным кодом.
 */
export const PLACEHOLDERS = {
  PROJECT_NAME: '__PROJECT_NAME__',
  DISPLAY_NAME: '__DISPLAY_NAME__',
  DESCRIPTION: '__DESCRIPTION__',
} as const

export function replaceOriginalsWithPlaceholders(content: string): string {
  let result = content

  result = result.replace(/"name":\s*"@maxhub\/max-front-app"/g, `"name": "${PLACEHOLDERS.PROJECT_NAME}"`)

  result = result.replace(/<title>max-front-app<\/title>/g,
    `<title>${PLACEHOLDERS.DISPLAY_NAME}</title>`)

  result = result.replace(/^# MAX Front App$/m, `# ${PLACEHOLDERS.DISPLAY_NAME}`)

  result = result.replace(
    /Миниапп-шаблон для приложений внутри мессенджера MAX\.\nБазовая архитектура для будущих miniapp-приложений на React \+ Vite \(Feature-Sliced Design\)\./,
    PLACEHOLDERS.DESCRIPTION,
  )

  return result
}

export function replacePlaceholdersWithValues(content: string, ctx: TransformContext): string {
  const replacements: Record<string, string> = {
    [PLACEHOLDERS.PROJECT_NAME]: ctx.projectName,
    [PLACEHOLDERS.DISPLAY_NAME]: ctx.displayName || ctx.projectName,
    [PLACEHOLDERS.DESCRIPTION]: ctx.description || '',
  }

  let result = content
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.split(placeholder).join(value)
  }

  return result
}

export function stripVersionCarets(content: string): string {
  return content.replace(/"\^/g, '"')
}

export function transformContent(
  content: string,
  ctx: TransformContext,
  relativePath?: string,
): string {
  const withPlaceholders = replaceOriginalsWithPlaceholders(content)
  let result = replacePlaceholdersWithValues(withPlaceholders, ctx)

  if (relativePath === 'package.json') {
    result = stripVersionCarets(result)
  }

  return result
}
