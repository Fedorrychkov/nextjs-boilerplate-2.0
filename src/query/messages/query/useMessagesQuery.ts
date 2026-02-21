import { ClientMessagesApi, MessageModel } from '~/api/messages'
import { useQueryBuilder } from '~/hooks/useQueryBuilder'
import { PaginationResponse } from '~/types'

const keyPrefix = 'chat-messages'

export const useMessagesQuery = (chatId: string | null, enabled = true, onSuccess?: (data: PaginationResponse<MessageModel>) => void) => {
  const key = chatId ? `${keyPrefix}-${chatId}` : keyPrefix

  const props = useQueryBuilder({
    key,
    enabled: !!chatId && enabled,
    options: {
      onSuccess: (data) => {
        onSuccess?.(data)
      },
    },
    method: async () => {
      if (!chatId) return { list: [], total: 0 }
      const api = new ClientMessagesApi()

      return api.getMessagesHistoryByChatId(chatId)
    },
  })

  return { ...props, key }
}
