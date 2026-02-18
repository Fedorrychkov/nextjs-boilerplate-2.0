import { isDevelop } from '@config/env'
import type { GetServerSidePropsContext, NextApiResponse } from 'next'

export interface CookieOptions {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  maxAge?: number
  domain?: string
}

export const clearAllAuthCookies = (res: NextApiResponse | GetServerSidePropsContext['res']) => {
  const secure = !isDevelop
  const secureFlag = secure ? '; Secure' : ''

  res.setHeader('Set-Cookie', [
    `accessToken=; HttpOnly; Path=/; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`,
    `refreshToken=; HttpOnly; Path=/; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`,
    `tokenExpiresIn=; HttpOnly; Path=/; SameSite=None; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`,
  ])
}
