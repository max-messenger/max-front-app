import { initTests } from '@post-process/tests'

import { setLogLevel } from './logger'
import { type SetupTestsOptions } from './types'

export async function setupTests(targetDir: string, options: SetupTestsOptions) {
  if (options.quiet) {
    setLogLevel('quiet')
  }
  await initTests(targetDir, options.dryRun, options.skipExamples)
}
