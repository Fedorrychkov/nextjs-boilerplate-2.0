import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import Message from '@lib/db/models/Message'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { MessageRole } from '~/api/messages'
import { time } from '~/utils/time'

export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res, req) => {
    const userId = authResult.payload.sub
    const body = await req.json()
    const { chatId, content, role } = body as { chatId: string; content: string; role?: string }

    if (!chatId || content == null) return res.json({ message: 'chatId and content required' }, { status: 400 })

    await connectDB()
    const chat = await Chat.findOne({ _id: chatId, userId })

    if (!chat) return res.json({ message: 'Chat not found' }, { status: 404 })

    const now = time().toISOString()
    const doc = await Message.create({
      chatId,
      role: role === MessageRole.ASSISTANT ? MessageRole.ASSISTANT : MessageRole.USER,
      content: String(content),
      createdAt: now,
      updatedAt: null,
    })

    return res.json(
      {
        id: doc._id.toString(),
        chatId: doc.chatId.toString(),
        role: doc.role,
        content: doc.content ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt ?? null,
      },
      { status: 201 },
    )
  })
}
