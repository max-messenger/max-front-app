import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import * as npmStats from 'npm-stats-api'

// Декларации типов (.d.ts) ошибочно объявляют именованные `stat`/`details`,
// поэтому обращаемся к `npm.stat` напрямую через ts-expect-error.
// @ts-expect-error в .d.ts нет экспорта `npm`, но в runtime он есть
const { stat } = npmStats.npm

const [pkg, start, end, out = 'stats.md'] = process.argv.slice(2)

if (!pkg || !start || !end) {
  console.error(
    'Использование: npx tsx src/stats.ts <package> <YYYY-MM-DD> <YYYY-MM-DD> [output.md]',
  )
  process.exit(1)
}

const OUT_PATH = resolve(process.cwd(), out)

;(async () => {
  try {
    const { body } = await stat(pkg, start, end)

    const line = `| ${pkg} | ${start} — ${end} | ${body.downloads} |`

    const header = '| Пакет | Период | Скачиваний |\n| --- | --- | --- |\n'
    const prev = existsSync(OUT_PATH)
      ? readFileSync(OUT_PATH, 'utf8')
      : header
    const next = prev.endsWith('\n') ? prev + line + '\n' : prev + '\n' + line + '\n'

    writeFileSync(OUT_PATH, next, 'utf8')
    console.log(`Записано в ${OUT_PATH}: ${pkg} | ${start} — ${end} | ${body.downloads}`)
  } catch (err) {
    console.error('Ошибка получения статистики:', err)
    process.exit(1)
  }
})()
