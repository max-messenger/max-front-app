import { Button } from '@maxhub/max-ui'

import { getAge } from '@/shared/lib/age-calculator'
import { FlexBox } from '@/shared/ui/FlexBox'
import { Modal, ModalButtons, ModalContent, ModalTitle } from '@/shared/ui/Modal'

import type { Dog } from '../../model/types'
import styles from './DogModal.module.scss'

type Props = {
  dog: Dog
  onCloseModal: () => void
}

export const DogModal = ({ dog, onCloseModal }: Props) => {
  return (
    <Modal size="xl" onClose={onCloseModal}>
      <ModalTitle>{dog?.name}</ModalTitle>
      <ModalContent>
        <FlexBox gap={16}>
          {dog.image && <img className={styles.image} src={dog.image} alt={dog.name} />}
          <FlexBox>
            <ul>
              <li>Возраст: {getAge(dog.age)}</li>
              <li>Обо мне: {dog.description}</li>
              <li>Любимая игрушка: {dog.toy}</li>
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
