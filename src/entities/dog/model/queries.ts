import { useQuery } from '@tanstack/react-query'

import { dogQueryKeys } from './query-keys'
import { dogRepository } from './repository'

export function useDogsQuery() {
  return useQuery({
    queryKey: dogQueryKeys.list(),
    queryFn: ({ signal }) => dogRepository.getDogs(signal)
  })
}

export function useDogQuery(dogKey?: string) {
  return useQuery({
    queryKey: dogQueryKeys.detail(dogKey ?? ''),
    queryFn: ({ signal }) => dogRepository.getDog(dogKey ?? '', signal),
    enabled: Boolean(dogKey)
  })
}
