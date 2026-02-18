import { apiErrorHandlerContainer } from '@lib/error'
import { roleMiddleware } from '@lib/middleware/auth.middleware'
import { NextRequest } from 'next/server'

import { RegisterByAdminDto } from '~/api/auth/types'
import { UserRole } from '~/api/user'
import { authService } from '~/services/auth.service'

// Middleware для проверки роли админа
const adminMiddleware = roleMiddleware([UserRole.ADMIN])

export async function POST(request: NextRequest) {
  // Проверяем аутентификацию и роль
  const authResult = await adminMiddleware(request)

  if (!authResult.success) {
    return authResult.response
  }

  return apiErrorHandlerContainer(request)(async (res, req) => {
    const body: RegisterByAdminDto = await req.json()

    const authResponse = await authService.registerByAdmin(body)

    const response = res.json(
      {
        success: true,
        ...authResponse,
      },
      { status: 201 },
    )

    return response
  })
}
