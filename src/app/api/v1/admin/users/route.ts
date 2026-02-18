import connectDB from '@lib/db/client'
import User from '@lib/db/models/User'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { roleMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { UserRole } from '~/api/user'

// Middleware для проверки роли админа
const adminMiddleware = roleMiddleware([UserRole.ADMIN])

export async function GET(request: NextRequest) {
  // Проверяем аутентификацию и роль
  const authResult = await adminMiddleware(request)

  if (!authResult.success) {
    return authResult.response
  }

  return apiErrorHandlerContainer(request)(async (res) => {
    await connectDB()

    const users = await User.find({}).select('-password').limit(50).lean()

    const usersData = users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      status: user.status,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    return res.json({ list: usersData })
  })
}
