import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { time } from '~/utils/time'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res, req) => {
    const { id } = await params
    const userId = authResult.payload.sub
    const body = await req.json().catch(() => ({}))
    const title = body.title ?? undefined

    await connectDB()
    const doc = await Chat.findOneAndUpdate({ _id: id, userId }, title !== undefined ? { title, updatedAt: time().toISOString() } : {}, { new: true })

    if (!doc) return res.json({ message: 'Chat not found' }, { status: 404 })

    return res.json(
      {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        title: doc.title ?? '',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt ?? null,
      },
      { status: 200 },
    )
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res) => {
    const { id } = await params
    const userId = authResult.payload.sub
    await connectDB()

    const doc = await Chat.findOneAndDelete({ _id: id, userId })

    if (!doc) return res.json({ message: 'Chat not found' }, { status: 404 })

    return res.json({}, { status: 204 })
  })
}
