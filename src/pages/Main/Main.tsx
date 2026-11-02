import { Spinner, Typography } from '@maxhub/max-ui'
import { useEffect, useState } from 'react'

import { DogCard, DogModal, useDogQuery, useDogsQuery } from '@/entities/dog'
import { useToast } from '@/shared/toast'
import { FlexBox } from '@/shared/ui/FlexBox'
import { Page } from '@/shared/ui/page'
import { Header } from '@/widgets/header'

import styles from './Main.module.scss'

export function Main() {
  const toast = useToast()
  const [dogKey, setDogKey] = useState<string>()

  const {
    data: dogs,
    isLoading: isDogsLoading,
    isError: isDogsError,
    error: dogsError
  } = useDogsQuery()
  const { data: dog, isError: isDogError, error: dogError } = useDogQuery(dogKey)

  useEffect(() => {
    if (!isDogsError) return

    toast.show({
      type: 'error',
      title: 'Не удалось загрузить список собак',
      description: dogsError.message || 'Попробуйте обновить страницу'
    })
  }, [isDogsError, dogsError, toast])

  useEffect(() => {
    if (!isDogError) return

    toast.show({
      type: 'error',
      title: 'Не удалось загрузить карточку собаки',
      description: dogError.message || 'Попробуйте открыть карточку ещё раз'
    })
  }, [isDogError, dogError, toast])

  const onCloseModal = () => {
    setDogKey(undefined)
  }

  return (
    <Page>
      <div className={styles.root}>
        <Header />
        {isDogsLoading
          ? (
            <FlexBox justifyContent="center" alignItems="center">
              <Spinner size={32} appearance="primary" />
            </FlexBox>
          )
          : dogs && dogs.length
            ? (
              <FlexBox gap={16} wrap="wrap">
                {dogs.map(el => (
                  <DogCard key={el.key} dog={el} onOpen={setDogKey} />
                ))}
              </FlexBox>
            )
            : (
              <FlexBox justifyContent="center" alignItems="center">
                <Typography.Body>Список пока пуст</Typography.Body>
              </FlexBox>
            )}
        {dogKey && dog && <DogModal dog={dog} onCloseModal={onCloseModal} />}
      </div>

    </Page>
  )
}
