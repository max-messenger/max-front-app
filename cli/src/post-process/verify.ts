import { execa } from 'execa'

import { logger, Spinner } from '../logger'

export async function verifyBuild(targetDir: string, dryRun: boolean) {
  const spinner = new Spinner(
    dryRun ? '[dry-run] Выполнение команды npm run build' : 'Запуск процесса сборки нового проекта (npm run build)...',
  )
  spinner.start()

  try {
    if (dryRun) {
      logger.info('  [exec]   npm run build')
    } else {
      await execa('npm', ['run', 'build'], { cwd: targetDir })
    }
    spinner.stop(dryRun ? '[dry-run] План сборки проекта сформирован' : 'Проект собран успешно')
  } catch (error) {
    spinner.stop()
    logger.error('Не удалось собрать проект.')
    if (error instanceof Error) {
      logger.warn(`Причина: ${error.message}`)
    }
  }
}
