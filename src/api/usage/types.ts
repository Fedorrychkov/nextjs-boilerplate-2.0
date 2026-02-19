import { UsageModel } from './model'

export type UsageFilter = Partial<Omit<UsageModel, 'createdAt' | 'updatedAt'>> & {
  limit?: number | null
  offset?: number | null
  startOfDateIso?: string | null
  endOfDateIso?: string | null
}
