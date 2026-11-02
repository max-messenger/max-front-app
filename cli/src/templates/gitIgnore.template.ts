import path from 'node:path'

import { type FileSpec } from '../types'

export const buildGitIgnore = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, '.gitignore'),
  content: `
node_modules
dist
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.env
stats.html
  `
})
