import { setAuthCookies } from '@lib/cookies'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { NextRequest } from 'next/server'

import { RegisterDto } from '~/api/auth/types'
import { authService } from '~/services/auth.service'

export async function POST(request: NextRequest) {
  return apiErrorHandlerContainer(request)(async (res, req) => {
    const body: RegisterDto = await req.json()

    const authResponse = await authService.register(body)

    const response = res.json(
      {
        success: true,
        message: 'registered successfully',
        user: authResponse.user,
      },
      { status: 201 },
    )

    setAuthCookies(response, authResponse.accessToken, authResponse.refreshToken, authResponse.expiresIn)

    return response
  })
}
