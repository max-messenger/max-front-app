import path from 'node:path'

import { type FileSpec } from '../types'

export const buildMainTSX = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'pages', 'Main', 'Main.tsx'),
  content: `import { Typography } from '@maxhub/max-ui'

import { ThemeToggleButton } from '@/features/toggle-theme'
import { FlexBox } from '@/shared/ui/FlexBox'
import { Page } from '@/shared/ui/page'

import styles from './Main.module.scss'

export function Main() {
  return (
    <Page>
      <div className={styles.root}>
        <FlexBox direction="column" alignItems="center" justifyContent="center" gap={24} className={styles.content}>
          <FlexBox direction="column" alignItems="center" gap={12}>
            <ThemeToggleButton />
            <Typography.Display>Проект готов</Typography.Display>
            <Typography.Body variant="large" className={styles.subtitle}>
              Шаблон max-front-app успешно создан. Начните разработку с изучения структуры проекта
            </Typography.Body>
          </FlexBox>

          <FlexBox direction="column" gap={0} className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <FlexBox direction="column" gap={2}>
                <Typography.Title variant="small-strong">Настройка окружения</Typography.Title>
                <Typography.Body variant="small" className={styles.muted}>
                  Установите необходимые вам зависимости (lodash, mobx).
                  Добавьте алиасы в tsconfig, подберите удобные правила для eslint
                </Typography.Body>
              </FlexBox>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <FlexBox direction="column" gap={2}>
                <Typography.Title variant="small-strong">Изучите структуру проекта</Typography.Title>
                <Typography.Body variant="small" className={styles.muted}>
                  FSD-архитектура: entities, features, pages, shared
                </Typography.Body>
              </FlexBox>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <FlexBox direction="column" gap={2}>
                <Typography.Title variant="small-strong">Начните кодить</Typography.Title>
                <Typography.Body variant="small" className={styles.muted}>
                  Замените этот контент своими компонентами.
                  Но не увлекайтесь нейронками.
                  Они зачастую забывают о быстродействии и безопасности
                </Typography.Body>
              </FlexBox>
            </div>
          </FlexBox>
          <FlexBox direction="column">
            <span className={styles.createdBy}>Created by БМП Infra Team</span>
          </FlexBox>
        </FlexBox>
      </div>
    </Page>
  )
}
`
})

export const buildMainSCSS = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'pages', 'Main', 'Main.module.scss'),
  content: `.root {
  position: relative;
  width: 100%;
  max-width: 560px;
  min-height: 100%;
  margin: 0 auto;
  padding: 0 16px;
}

.content {
  min-height: calc(100vh - 16px);
}

.subtitle {
  text-align: center;
  color: var(--icon-tertiary);
  max-width: 360px;
}

.muted {
  color: var(--icon-tertiary);
}

.steps {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-card);
  border: 1px solid var(--background-tertiary);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--background-tertiary);
  }
}

.stepNumber {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: var(--counter-themed);
  background: var(--background-tertiary);
}

.createdBy {
  font-size: 12px;
  color: var(--icon-tertiary);
}
`
})

export const buildMainIndexTS = (targetDir: string): FileSpec => ({
  relativePath: path.join(targetDir, 'src', 'pages', 'Main', 'index.ts'),
  content: `export { Main } from './Main'\n`
})
