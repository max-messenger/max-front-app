import { rm } from 'node:fs/promises'
import path from 'node:path'
import { build } from 'esbuild'

// Алиасы папок-источников. Должны совпадать с `paths` в tsconfig.json,
// чтобы esbuild разрешал те же импорты (@helpers, @post-process, @generate),
// что и TypeScript/tsx.
const alias = {
  '@helpers': path.resolve('src/helpers'),
  '@post-process': path.resolve('src/post-process'),
  '@generate': path.resolve('src/generate'),
}

await rm('dist', { recursive: true, force: true })

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outfile: 'dist/index.cjs',
  banner: { js: '#!/usr/bin/env node' },
  alias,
  logLevel: 'info',
})

console.log('✓ CLI собран в dist/index.cjs')
