import { ChatModel } from './model'

export type ChatFilter = Partial<Omit<ChatModel, 'createdAt' | 'updatedAt'>> & {
  limit?: number | null
  offset?: number | null
  startOfDateIso?: string | null
  endOfDateIso?: string | null
}
