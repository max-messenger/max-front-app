import { apiRequest } from '@/shared/api'

import type { DogListResponse, DogResponse } from './types'

const DOGS_API_BASE = '/v1/dogs'

export async function getDogsApi(signal?: AbortSignal) {
  const response = await apiRequest<DogListResponse>(DOGS_API_BASE, {
    method: 'GET',
    signal
  })
  return response.data
}

export async function getDogApi(key: string, signal?: AbortSignal) {
  const response = await apiRequest<DogResponse>(`${DOGS_API_BASE}/${key}`, {
    method: 'GET',
    signal
  })
  return response.data
}
