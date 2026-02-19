import { AnyString } from '~/types'

export type SubscriptionModel = {
  id: string
  userId: string
  status: SubscriptionStatus
  type: SubscriptionType
  /**
   * 0 - by default
   */
  price: number
  currency: 'USD' | AnyString
  /**
   * max limit of tokens for the current subscription
   */
  totalTokensLimit: number
  expiresAt?: string | null
  createdAt: string
  updatedAt?: string | null
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum SubscriptionType {
  FREE = 'free',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
