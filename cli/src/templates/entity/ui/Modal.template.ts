import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildModal = (
  { camelCase, PascalCase }: Names, entityDir: string
): FileSpec => ({
  relativePath: path.join(entityDir, 'ui', `${PascalCase}Modal`, `${PascalCase}Modal.tsx`),
  content: `import { Button } from '@maxhub/max-ui'

import { FlexBox } from '@/shared/ui/FlexBox'
import { Modal, ModalButtons, ModalContent, ModalTitle } from '@/shared/ui/Modal'

import type { ${PascalCase} } from '../../model/types'
import styles from './${PascalCase}Modal.module.scss'

type Props = {
  ${camelCase}: ${PascalCase}
  onCloseModal: () => void
}

export const ${PascalCase}Modal = ({ ${camelCase}, onCloseModal }: Props) => {
  return (
    <Modal size="xl" onClose={onCloseModal}>
      <ModalTitle>{${camelCase}?.name}</ModalTitle>
      <ModalContent>
        <FlexBox gap={16}>
          <FlexBox>
            <ul>
              <li>ID: {${camelCase}.id}</li>
              <li>Создан: {${camelCase}.createdAt}</li>
            </ul>
          </FlexBox>
        </FlexBox>
      </ModalContent>
      <ModalButtons>
        <Button size="small" variant="primary" onClick={onCloseModal}>Закрыть</Button>
      </ModalButtons>
    </Modal>
  )
}
`
})
