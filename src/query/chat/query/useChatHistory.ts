import { ChatModel, ClientChatApi } from '~/api/chat'
import { useQueryBuilder } from '~/hooks/useQueryBuilder'
import { PaginationResponse } from '~/types'

export const useChatHistoryQuery = (enabled = true, onSuccess?: (data: PaginationResponse<ChatModel>) => void) => {
  const key = 'user-chat-history'

  const props = useQueryBuilder({
    key,
    enabled,
    method: async () => {
      const api = new ClientChatApi()
      const result = await api.getChatHistory()

      return result
    },
    options: {
      onSuccess: (data) => {
        onSuccess?.(data)
      },
    },
  })

  return {
    ...props,
    key,
  }
}
