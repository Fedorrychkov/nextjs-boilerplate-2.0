'use client'

import { MenuIcon, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { SpinnerScreen } from '~/components/Loaders'
import { Button } from '~/components/ui'
import { useSwitch } from '~/hooks/useSwitch'
import { useAuth } from '~/providers'
import { useChatHistoryQuery } from '~/query/chat'
import { cn } from '~/utils'

import { ChatBlock } from './ChatBlock'
import { ChatHistory } from './ChatHistory'

export const ChatScreen = () => {
  const { authUser } = useAuth()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [isOpened, { toggle, off }] = useSwitch(false)

  useEffect(() => {
    off()
  }, [off, selectedChatId, isNew])

  const { data: chatHistory, isLoading: isLoadingChatHistory } = useChatHistoryQuery(!!authUser?.id, (data) => {
    if (data.list.length > 0 && selectedChatId === null && !isNew) {
      setSelectedChatId(data.list[0].id)
    }
  })

  const handleAddChat = () => {
    setIsNew(true)
    setSelectedChatId(null)
  }

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id)
    setIsNew(false)
  }

  const handleChatCreated = (id: string) => {
    setSelectedChatId(id)
    setIsNew(false)
  }

  return (
    <div className="flex h-full w-full flex-row items-start gap-4 overflow-hidden max-h-[calc(100vh-152px)]">
      {/* Слева: кнопка нового чата + список чатов */}
      <aside className="flex shrink-0 flex-col gap-2 border-r pr-2">
        <button type="button" onClick={toggle} className="md:hidden">
          <MenuIcon className="h-4 w-4" />
        </button>
        <div className={cn('flex max-w-64 flex-col gap-2 h-full', isOpened ? 'block' : 'hidden md:block')}>
          <Button type="button" variant="outline" size="sm" onClick={handleAddChat} className="w-full justify-start">
            <PlusIcon className="h-4 w-4" />
            Новый чат
          </Button>
          {isLoadingChatHistory ? (
            <SpinnerScreen />
          ) : (
            <ChatHistory
              chatHistory={chatHistory?.list ?? []}
              selectedChatId={isNew ? null : selectedChatId}
              onSelectChat={handleSelectChat}
              className="min-h-0 flex-1 overflow-auto"
            />
          )}
        </div>
      </aside>

      {/* Справа: контент чата + поле ввода */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {(selectedChatId !== null || isNew) && !isLoadingChatHistory ? (
          <ChatBlock chatId={isNew ? null : selectedChatId} isNew={isNew} onChatCreated={handleChatCreated} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Выберите чат или создайте новый</div>
        )}
      </main>
    </div>
  )
}
