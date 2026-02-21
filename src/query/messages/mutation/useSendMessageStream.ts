import { useQueryClient } from 'react-query'

import { ClientMessagesApi } from '~/api/messages'

import { useMessagesQuery } from '../query/useMessagesQuery'

/**
 * Отправка сообщения со стримом ответа LLM.
 * Возвращает ReadableStream для отображения ответа по чанкам.
 * После завершения стрима инвалидирует список сообщений чата.
 */
export const useSendMessageStream = (chatId: string | null) => {
  const queryClient = useQueryClient()
  const { key } = useMessagesQuery(chatId, false)

  const sendStream = async (content: string): Promise<ReadableStream<Uint8Array> | null> => {
    if (!chatId) return null
    const api = new ClientMessagesApi()
    const stream = await api.sendMessageStream(chatId, content)

    return stream
  }

  const invalidateMessages = () => {
    if (chatId) queryClient.invalidateQueries(key)
  }

  return { sendStream, invalidateMessages }
}
