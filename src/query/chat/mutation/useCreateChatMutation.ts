import { useMutation, useQueryClient } from 'react-query'

import { ClientChatApi, CreateChatPayload } from '~/api/chat'

import { useChatHistoryQuery } from '../query/useChatHistory'

/**
 * @deprecated
 */
export const useCreateChatMutation = () => {
  const queryClient = useQueryClient()
  const { key } = useChatHistoryQuery(false)

  const createMutation = useMutation(async (payload?: CreateChatPayload) => {
    const api = new ClientChatApi()

    return api.createChat(payload)
  })

  const mutate = async (payload?: CreateChatPayload) => {
    const result = await createMutation.mutateAsync(payload)
    queryClient.invalidateQueries(key)

    return result
  }

  return { createMutation: { ...createMutation, mutateAsync: mutate }, mutate }
}
