'use client'

import type { ChatModel } from '~/api/chat'
import { cn } from '~/utils/cn'

type ChatHistoryProps = {
  chatHistory: ChatModel[]
  selectedChatId: string | null
  onSelectChat: (id: string) => void
  className?: string
}

export const ChatHistory = ({ chatHistory, selectedChatId, onSelectChat, className }: ChatHistoryProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <ul className="flex flex-col gap-0.5 overflow-auto">
        {chatHistory.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                selectedChatId === chat.id ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/60',
              )}
            >
              <span className="truncate block">{chat.title || 'Без названия'}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
