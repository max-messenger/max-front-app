export const dogQueryKeys = {
  all: ['dogs'] as const,

  list() {
    return [...dogQueryKeys.all, 'list'] as const
  },

  detail(dogKey: string) {
    return [...dogQueryKeys.all, 'detail', dogKey] as const
  }
}
