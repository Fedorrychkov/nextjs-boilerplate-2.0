import { useMutation, useQueryClient } from 'react-query'

import { ClientChatApi, UpdateChatPayload } from '~/api/chat'

import { useChatHistoryQuery } from '../query/useChatHistory'

export const useUpdateChatMutation = () => {
  const queryClient = useQueryClient()
  const { key } = useChatHistoryQuery(false)

  const updateMutation = useMutation(async ({ chatId, payload }: { chatId: string; payload: UpdateChatPayload }) => {
    const api = new ClientChatApi()

    return api.updateChat(chatId, payload)
  })

  const mutate = async (chatId: string, payload: UpdateChatPayload) => {
    const result = await updateMutation.mutateAsync({ chatId, payload })
    queryClient.invalidateQueries(key)

    return result
  }

  return { updateMutation: { ...updateMutation, mutateAsync: mutate }, mutate }
}
