import connectDB from '@lib/db/client'
import Usage from '@lib/db/models/Usage'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { authMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Проверяем аутентификацию
  const authResult = await authMiddleware(request)

  if (!authResult.success) {
    return authResult.response
  }

  return apiErrorHandlerContainer(request)(async (res) => {
    const user = authResult.payload

    await connectDB()
    const usageDoc = await Usage.find({ userId: user.sub })

    const usage = usageDoc.map((usage) => usage.toObject())

    const total = usageDoc.length ?? 0

    return res.json(
      {
        list: usage,
        total,
      },
      { status: 200 },
    )
  })
}
