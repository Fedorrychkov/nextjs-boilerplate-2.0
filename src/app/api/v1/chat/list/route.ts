import connectDB from '@lib/db/client'
import Chat from '@lib/db/models/Chat'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authResult = await authMiddleware(request)

  if (!authResult.success) return authResult.response

  return apiErrorHandlerContainer(request)(async (res) => {
    const userId = authResult.payload.sub
    await connectDB()

    const docs = await Chat.find({ userId }).sort({ createdAt: -1 }).lean()
    const list = docs.map((d) => ({
      id: d._id.toString(),
      userId: d.userId.toString(),
      title: d.title ?? '',
      createdAt: d.createdAt,
      updatedAt: d.updatedAt ?? null,
    }))

    return res.json({ list, total: list.length }, { status: 200 })
  })
}
