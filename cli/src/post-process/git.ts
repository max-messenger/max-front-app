import { execa } from 'execa'

import { logger, Spinner } from '../logger'

/**
 * Инициализирует git репозиторий в целевой директории.
 *
 * В режиме dry-run команды не выполняются, в лог выводится план.
 */
export async function initGit(targetDir: string, dryRun = false): Promise<void> {
  const spinner = new Spinner(dryRun ? '[dry-run] Инициализация git...' : 'Инициализация git...')
  spinner.start()

  try {
    if (dryRun) {
      logger.info('  [exec]   git init')
      logger.info('  [exec]   git add .')
      logger.info('  [exec]   git commit -m "chore: initial commit"')
    } else {
      await execa('git', ['init'], { cwd: targetDir })
      await execa('git', ['add', '.'], { cwd: targetDir })
      await execa('git', ['commit', '-m', 'chore: initial commit'], { cwd: targetDir })
    }
    spinner.stop(dryRun ? '[dry-run] План git init сформирован' : 'Git репозиторий инициализирован')
  } catch (error) {
    spinner.stop()
    logger.warn('Не удалось инициализировать git. Вы можете сделать это вручную: git init')
    if (error instanceof Error) {
      logger.warn(`Причина: ${error.message}`)
    }
  }
}
