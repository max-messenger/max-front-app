import { type MockHandler, registerMock } from '@/shared/api/mock-registry'

import type { DogListResponse, DogResponse } from '../../api/types'
import dogsMock from './dogs.json'

export function registerDogMocks(): void {
  registerMock('GET', '/v1/dogs', dogsMock as DogListResponse)

  const getDogHandler: MockHandler = ({ params }): DogResponse | null => {
    const dog = (dogsMock as DogListResponse).data.find(d => d.key === params.key)
    return dog ? { data: dog } : null
  }
  registerMock('GET', '/v1/dogs/:key', getDogHandler)
}
