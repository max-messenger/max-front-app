import { execa } from 'execa'

import { logger, Spinner } from '../logger'

/**
 * Устанавливает зависимости через npm.
 *
 * В режиме dry-run команда не выполняется, в лог выводится план.
 */
export async function installDependencies(targetDir: string, dryRun = false): Promise<void> {
  const spinner = new Spinner(
    dryRun ? '[dry-run] Установка зависимостей (npm install)...' : 'Установка зависимостей (npm install)...',
  )
  spinner.start()

  try {
    if (dryRun) {
      logger.info('  [exec]   npm install ')
    } else {
      await execa('npm', ['install'], { cwd: targetDir })
    }
    spinner.stop(dryRun ? '[dry-run] План установки зависимостей сформирован' : 'Зависимости установлены')
  } catch (error) {
    spinner.stop()
    logger.error('Не удалось установить зависимости автоматически.')
    logger.info('Вы можете установить их вручную: cd <project> && npm install')
    if (error instanceof Error) {
      logger.warn(`Причина: ${error.message}`)
    }
  }
}
