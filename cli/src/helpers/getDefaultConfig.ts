import path from 'node:path'

import type { ProjectConfig } from '../types'

export function getDefaultConfig(targetDir: string): ProjectConfig {
  const defaultName = path.basename(path.resolve(targetDir))

  return {
    projectName: defaultName,
    targetDir,
    displayName: defaultName,
    description: 'Проект на базе max-front-app',
    initGit: true,
    installDeps: true,
    initTests: false,
    dryRun: false,
  }
}
