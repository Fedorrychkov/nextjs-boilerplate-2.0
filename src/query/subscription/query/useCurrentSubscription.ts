import { ClientSubscriptionApi } from '~/api/subscription'
import { useQueryBuilder } from '~/hooks/useQueryBuilder'

export const useCurrentSubscriptionQuery = (enabled = true) => {
  const key = 'user-current-subscription'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientSubscriptionApi()
      const result = await api.getCurrentSubscription()

      return result
    },
  })

  return {
    ...props,
    key,
  }
}
