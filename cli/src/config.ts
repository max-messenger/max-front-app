import { getDefaultConfig } from '@helpers'

import { runPrompts } from './prompts'
import type { CliOptions, ProjectConfig } from './types'

export async function getConfig(options: CliOptions, targetDir: string): Promise<ProjectConfig> {
  const config: ProjectConfig = options.skipPrompts
    ? getDefaultConfig(targetDir)
    : await runPrompts(targetDir)

  // Переопределяем из CLI-флагов
  if (options.git === false) config.initGit = false
  if (options.install === false) config.installDeps = false
  config.dryRun = options.dryRun === true

  return config
}
