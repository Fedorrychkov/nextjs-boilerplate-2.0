import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

import { PaginationResponse } from '~/types'

import { MessageModel } from '../model'

export class ClientMessagesApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getMessagesHistoryByChatId(chatId: string): Promise<PaginationResponse<MessageModel>> {
    const response = await this.client.get(`/api/v1/messages/list?chatId=${chatId}`)

    return response.data
  }

  async sendNewMessage(chatId: string, content: string): Promise<MessageModel> {
    const response = await this.client.post<MessageModel>('/api/v1/messages', { chatId, content })

    return response.data
  }

  /**
   * Отправка сообщения со стримингом ответа LLM.
   * Возвращает ReadableStream с текстовыми чанками ответа ассистента.
   */
  async sendMessageStream(chatId: string, content: string): Promise<ReadableStream<Uint8Array> | null> {
    const res = await fetch('/api/v1/messages/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ chatId, content }),
    })

    if (!res.ok || !res.body) return null

    return res.body
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.client.delete(`/api/v1/messages/${messageId}`)
  }
}
