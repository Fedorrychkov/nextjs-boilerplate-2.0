import { ClientUsageApi } from '~/api/usage'
import { useQueryBuilder } from '~/hooks/useQueryBuilder'

export const useUsageTokensQuery = (enabled = true) => {
  const key = 'user-usage-history'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientUsageApi()
      const result = await api.getTotalUsageTokens()

      return result
    },
  })

  return {
    ...props,
    key,
  }
}
