import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import Message from '@lib/db/models/Message'
import Usage from '@lib/db/models/Usage'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { MessageRole } from '~/api/messages'
import { llmService } from '~/services/llm.service'
import { time } from '~/utils/time'

/** Разделитель кадров: клиент по нему берёт последний кадр (целый safe fullContent), дублей нет */
const FRAME_DELIM = new Uint8Array([0, 0, 0, 0])
const PII_CHARS_DELTA = 80

export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  // TODO: проверять currentUsage limits и валидировать доступ к реквестам
  return apiErrorHandlerContainer(request)(async (res, req) => {
    const userId = authResult.payload.sub
    const body = await req.json()
    const { chatId, content } = body as { chatId: string; content: string }

    if (!chatId || content == null) return res.json({ message: 'chatId and content required' }, { status: 400 })

    await connectDB()
    const chat = await Chat.findOne({ _id: chatId, userId })

    if (!chat) return res.json({ message: 'Chat not found' }, { status: 404 })

    const now = time().toISOString()
    await Message.create({
      chatId,
      role: MessageRole.USER,
      content: String(content),
      createdAt: now,
      updatedAt: null,
    })

    const history = await Message.find({ chatId }).sort({ createdAt: 1 }).lean()
    const messagesForLlm = history.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: (m.content ?? '') as string,
    }))

    const encoder = new TextEncoder()
    let fullContent = ''
    let lastSafeFull = ''
    let fullContentToSafe = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of llmService.chatStream(messagesForLlm)) {
            fullContent += chunk

            // TODO:? не отправлять данные без обработки Pii
            // controller.enqueue(encoder.encode(fullContent))
            // controller.enqueue(FRAME_DELIM)

            const diff = fullContent?.trim?.()?.replace(/\s/g, '')?.length - fullContentToSafe?.trim?.()?.replace(/\s/g, '')?.length

            if (diff > PII_CHARS_DELTA) {
              fullContentToSafe = fullContent
              lastSafeFull = await llmService.detectAndWrapPii(fullContentToSafe)
              controller.enqueue(encoder.encode(lastSafeFull))
              controller.enqueue(FRAME_DELIM)
            }
          }

          fullContentToSafe = fullContent
          lastSafeFull = await llmService.detectAndWrapPii(fullContentToSafe)
          controller.enqueue(encoder.encode(lastSafeFull))
          controller.enqueue(FRAME_DELIM)

          // TODO: Get current usage, now is mock settlement

          await Usage.create({
            userId,
            totalTokens: 1000,
            createdAt: time().toISOString(),
            updatedAt: null,
          })

          await Message.create({
            chatId,
            role: MessageRole.ASSISTANT,
            content: lastSafeFull,
            createdAt: time().toISOString(),
            updatedAt: null,
          })
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  })
}
