'use client'

import { ArrowUpIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'

import type { MessageModel } from '~/api/messages'
import { ClientMessagesApi, MessageRole } from '~/api/messages'
import { SpinnerScreen } from '~/components/Loaders'
import { Button } from '~/components/ui'
import { Textarea } from '~/components/ui/fields'
import { useCreateChatMutation } from '~/query/chat'
import { useMessagesQuery } from '~/query/messages'
import { cn } from '~/utils/cn'

import { MessageContent } from './MessageContent'

function findLastDelim(buffer: Uint8Array, delim: Uint8Array): number {
  if (buffer.length < delim.length) return -1

  for (let i = buffer.length - delim.length; i >= 0; i--) {
    let match = true

    for (let j = 0; j < delim.length; j++) {
      if (buffer[i + j] !== delim[j]) {
        match = false
        break
      }
    }

    if (match) return i
  }

  return -1
}

type ChatBlockProps = {
  chatId: string | null
  isNew?: boolean
  onChatCreated?: (id: string) => void
}

export const ChatBlock = ({ chatId, isNew, onChatCreated }: ChatBlockProps) => {
  const [inputValue, setInputValue] = useState('')
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const listEndRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useMessagesQuery(chatId, !!chatId && !isNew, (data) => {
    if (data.list.length > 0) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  })
  const { mutate: createChat } = useCreateChatMutation()

  const messages: MessageModel[] = messagesData?.list ?? []
  const displayMessages = [...messages]

  if (streamingContent !== null) {
    displayMessages.push({
      id: '__streaming__',
      chatId: chatId ?? '',
      role: MessageRole.ASSISTANT,
      content: streamingContent,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    })
  }

  const handleSend = async () => {
    const text = inputValue.trim()

    if (!text || isSending) return

    let currentChatId = chatId

    if (isNew || !currentChatId) {
      try {
        const newChat = await createChat({ title: text.slice(0, 50) })

        currentChatId = newChat.id
        onChatCreated?.(newChat.id)
      } catch {
        return
      }
    }

    if (!currentChatId) return

    setInputValue('')
    setIsSending(true)
    setStreamingContent('')

    try {
      const stream = await new ClientMessagesApi().sendMessageStream(currentChatId, text)

      if (!stream) {
        setStreamingContent(null)
        queryClient.invalidateQueries(`chat-messages-${currentChatId}`)

        return
      }

      await refetchMessages()

      const reader = stream.getReader()
      const decoder = new TextDecoder()
      const FRAME_DELIM = new Uint8Array([0, 0, 0, 0])
      let buffer = new Uint8Array(0)

      while (true) {
        const { done, value } = await reader.read()

        if (done) break
        const newBuf = new Uint8Array(buffer.length + (value?.length ?? 0))
        newBuf.set(buffer)

        if (value) newBuf.set(value, buffer.length)
        buffer = newBuf

        const lastIdx = findLastDelim(buffer, FRAME_DELIM)

        if (lastIdx !== -1) {
          const beforeLast = buffer.subarray(0, lastIdx)
          const prevIdx = findLastDelim(beforeLast, FRAME_DELIM)
          const frameStart = prevIdx === -1 ? 0 : prevIdx + FRAME_DELIM.length
          const frame = buffer.slice(frameStart, lastIdx)

          setStreamingContent(decoder.decode(frame))
        }
      }
    } finally {
      setStreamingContent(null)
      queryClient.invalidateQueries(`chat-messages-${currentChatId}`)
      setIsSending(false)
    }
  }

  if (chatId === null && !isNew) {
    return <div className="flex flex-1 items-center justify-center text-muted-foreground">Выберите чат или создайте новый</div>
  }

  if (isNew && !chatId && messages.length === 0 && !streamingContent) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto p-4 min-h-[calc(100vh-340px)]" />
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type message for new chat..."
              className="min-w-0 flex-1"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            />
            <Button type="button" size="icon" onClick={handleSend} disabled={isSending || !inputValue.trim()}>
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoadingMessages && messages.length === 0) {
    return <SpinnerScreen />
  }

  return (
    <div className="flex flex-1 relative flex-col min-h-0">
      <div className="flex-1 p-4 pb-[105px] max-h-[calc(100vh-152px)] overflow-auto space-y-3">
        {/* <div className="flex-1 overflow-auto p-4 space-y-3"> */}
        {displayMessages.map((msg) => (
          <div key={msg.id} className={cn('min-w-[10%] max-w-fit', msg.role === MessageRole.USER ? 'ml-auto' : 'mr-auto')}>
            <div className={cn('rounded-lg px-3 py-2 ', msg.role === MessageRole.USER ? 'ml-8 bg-primary text-primary-foreground' : 'mr-8 bg-muted')}>
              <MessageContent content={msg.content ?? ''} />
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>
      <div className="border-t bg-white p-3 absolute bottom-0 left-0 right-0">
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message..."
            className="min-w-0 flex-1"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <Button type="button" size="icon" onClick={handleSend} disabled={isSending || !inputValue.trim()}>
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
