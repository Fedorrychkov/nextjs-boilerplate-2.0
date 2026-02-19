import connectDB from '@lib/db/client'
import Subscription from '@lib/db/models/Subscription'
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
    const subscriptionDoc = await Subscription.findOne({ userId: user.sub })

    if (!subscriptionDoc) {
      return res.json({ message: 'Subscription not found' }, { status: 404 })
    }

    const { _id, ...subscription } = subscriptionDoc.toObject()

    return res.json(
      {
        id: subscriptionDoc._id.toString(),
        ...subscription,
      },
      { status: 200 },
    )
  })
}
