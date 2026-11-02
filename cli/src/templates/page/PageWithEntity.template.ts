import path from 'node:path'

import { resolveEntityNames } from '@helpers'

import type { FileSpec, Names } from '../../types'

/**
 * Собираем шаблон страницы src/pages/Main.tsx из оригинального шаблона
 * Импортируется public api сущности entityName и заменяются все вызовы
 * Рендерится список сущностей, обрабатывается ошибка получения
 *
 * @param pageNaming
 * @param pageDir
 * @param entityName
 */
export function buildPageWithEntity(
  pageNaming: Names, pageDir: string, entityName: string
): FileSpec {
  const entityNaming = resolveEntityNames(entityName)

  return {
    relativePath: path.join(pageDir, `${pageNaming.PascalCase}.tsx`),
    content: `import { Spinner, Typography } from '@maxhub/max-ui'
import { useEffect, useState } from 'react'

import { ${entityNaming.PascalCase}Card, use${entityNaming.PascalCase}sQuery } from '@/entities/${entityNaming.kebabCase}'
import { useToast } from '@/shared/toast'
import { FlexBox } from '@/shared/ui/FlexBox'
import { Page } from '@/shared/ui/page'
import { Header } from '@/widgets/header'

import styles from './${pageNaming.PascalCase}.module.scss'

export function ${pageNaming.PascalCase}Page() {
  const toast = useToast()
  const [selected${entityNaming.PascalCase}, setSelected${entityNaming.PascalCase}] = useState<string>()

  const {
    data: list,
    isLoading: isListLoading,
    isError: isListError,
    error: listError
  } = use${entityNaming.PascalCase}sQuery()

  useEffect(() => {
    if (!isListError) return

    toast.show({
      type: 'error',
      title: 'Не удалось загрузить список ${entityNaming.camelCase}',
      description: listError.message || 'Попробуйте обновить страницу'
    })
  }, [isListError, listError, toast])

  return (
    <Page>
      <div className={styles.root}>
        <Header />
        {isListLoading
          ? (
            <FlexBox justifyContent="center" alignItems="center">
              <Spinner size={32} appearance="primary" />
            </FlexBox>
          )
          : list && list.length
            ? (
              <FlexBox gap={16} wrap="wrap">
                {list.map(el => (
                  <${entityNaming.PascalCase}Card key={el.id} ${entityNaming.camelCase}={el} onOpen={setSelected${entityNaming.PascalCase}} />
                ))}
              </FlexBox>
            )
            : (
              <FlexBox justifyContent="center" alignItems="center">
                <Typography.Body>Список пока пуст</Typography.Body>
              </FlexBox>
            )}
      </div>
    </Page>
  )
}
`
  }
}
