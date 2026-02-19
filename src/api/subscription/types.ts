import { SubscriptionModel } from './model'

export type SubscriptionFilter = Partial<Omit<SubscriptionModel, 'createdAt' | 'updatedAt'>> & {
  limit?: number | null
  offset?: number | null
  startOfDateIso?: string | null
  endOfDateIso?: string | null
}
