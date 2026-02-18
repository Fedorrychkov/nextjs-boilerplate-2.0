import { clearAuthCookies } from '@lib/cookies'
import { apiErrorHandlerContainer } from '@lib/error/api-error-handler'
import { decodeToken } from '@lib/jwt/utils'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

import { authService } from '~/services/auth.service'

export async function POST(request: NextRequest) {
  return apiErrorHandlerContainer(request)(async (res, _req) => {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value ?? null

    if (refreshToken) {
      const payload = decodeToken(refreshToken)

      if (payload?.sub) {
        await authService.logout(refreshToken, payload.sub)
      }
    }

    const response = res.json({ success: true, message: 'Logged out successfully' }, { status: 200 })
    clearAuthCookies(response)

    return response
  })
}
