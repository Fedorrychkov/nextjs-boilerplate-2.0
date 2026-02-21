import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import Message from '@lib/db/models/Message'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res) => {
    const userId = authResult.payload.sub
    const chatId = request.nextUrl.searchParams.get('chatId')

    if (!chatId) return res.json({ message: 'chatId required' }, { status: 400 })

    await connectDB()
    const chat = await Chat.findOne({ _id: chatId, userId })

    if (!chat) return res.json({ message: 'Chat not found' }, { status: 404 })

    const docs = await Message.find({ chatId }).sort({ createdAt: 1 }).lean()
    const list = docs.map((d) => ({
      id: d._id.toString(),
      chatId: d.chatId.toString(),
      role: d.role,
      content: d.content ?? null,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt ?? null,
    }))

    return res.json({ list, total: list.length }, { status: 200 })
  })
}
