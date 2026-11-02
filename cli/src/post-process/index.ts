import { logger } from '../logger'
import type { ProjectConfig } from '../types'
import { installDependencies } from './dependencies'
import { cleanExamples } from './examples'
import { initGit } from './git'
import { initTests } from './tests'
import { verifyBuild } from './verify'

/**
 * Выполняет все пост-обработки: очистку примеров, git init, install.
 *
 * В режиме dry-run шаги логируются, но не выполняются.
 */
export async function runPostProcessing(config: ProjectConfig): Promise<void> {
  logger.newLine()

  await cleanExamples(config.targetDir, config.dryRun)

  if (config.initTests) {
    await initTests(config.targetDir, config.dryRun)
  }

  if (config.initGit) {
    await initGit(config.targetDir, config.dryRun)
  }

  if (config.installDeps) {
    await installDependencies(config.targetDir, config.dryRun)
    await verifyBuild(config.targetDir, config.dryRun)
  }
}
