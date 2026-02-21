import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import Message from '@lib/db/models/Message'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res) => {
    const userId = authResult.payload.sub
    const { id } = await params
    await connectDB()

    const msg = await Message.findById(id).lean()

    if (!msg) return res.json({ message: 'Message not found' }, { status: 404 })
    const chat = await Chat.findOne({ _id: msg.chatId, userId })

    if (!chat) return res.json({ message: 'Forbidden' }, { status: 403 })

    await Message.findByIdAndDelete(id)

    return res.json({}, { status: 204 })
  })
}
