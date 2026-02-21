import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

import { PaginationResponse } from '~/types'

import { ChatModel } from '../model'

export type CreateChatPayload = { title?: string | null }
export type UpdateChatPayload = { title?: string | null }

export class ClientChatApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getChatHistory(): Promise<PaginationResponse<ChatModel>> {
    const response = await this.client.get('/api/v1/chat/list')

    return response.data
  }

  async createChat(payload?: CreateChatPayload): Promise<ChatModel> {
    const response = await this.client.post<ChatModel>('/api/v1/chat', payload ?? {})

    return response.data
  }

  async updateChat(chatId: string, payload: UpdateChatPayload): Promise<ChatModel> {
    const response = await this.client.patch<ChatModel>(`/api/v1/chat/${chatId}`, payload)

    return response.data
  }

  async deleteChat(chatId: string): Promise<void> {
    await this.client.delete(`/api/v1/chat/${chatId}`)
  }
}
