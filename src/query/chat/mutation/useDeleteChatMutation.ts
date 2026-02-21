import { useMutation, useQueryClient } from 'react-query'

import { ClientChatApi } from '~/api/chat'

import { useChatHistoryQuery } from '../query/useChatHistory'

export const useDeleteChatMutation = () => {
  const queryClient = useQueryClient()
  const { key } = useChatHistoryQuery(false)

  const deleteMutation = useMutation(async (chatId: string) => {
    const api = new ClientChatApi()
    await api.deleteChat(chatId)
  })

  const mutate = async (chatId: string) => {
    await deleteMutation.mutateAsync(chatId)
    queryClient.invalidateQueries(key)
  }

  return { deleteMutation: { ...deleteMutation, mutateAsync: mutate }, mutate }
}
