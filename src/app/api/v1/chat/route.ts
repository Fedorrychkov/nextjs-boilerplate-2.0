import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { time } from '~/utils/time'

export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res, req) => {
    const userId = authResult.payload.sub
    const body = await req.json().catch(() => ({}))
    const title = body.title ?? null

    await connectDB()
    const now = time().toISOString()
    const doc = await Chat.create({
      title,
      userId,
      createdAt: now,
      updatedAt: null,
    })

    return res.json(
      {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        title: doc.title ?? '',
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt ?? null,
      },
      { status: 201 },
    )
  })
}
