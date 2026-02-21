export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type MessageModel = {
  id: string
  chatId: string
  role?: MessageRole | null
  content?: string | null
  createdAt: string
  updatedAt?: string | null
}
