import { MessageModel } from './model'

export type MessageFilter = Partial<Omit<MessageModel, 'createdAt' | 'updatedAt'>> & {
  limit?: number | null
  offset?: number | null
  startOfDateIso?: string | null
  endOfDateIso?: string | null
}
