import { getDogApi, getDogsApi } from '../api/api'

export const dogRepository = {
  getDogs(signal?: AbortSignal) {
    return getDogsApi(signal)
  },

  getDog(key: string, signal?: AbortSignal) {
    return getDogApi(key, signal)
  }
}
