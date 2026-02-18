import { UserModel, UserRole, UserStatus } from '../user'

export type JwtPayload = {
  sub: string
  email: string
  role: UserRole
  status: UserStatus | null
  exp?: number
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  /**
   * Истечение основного токена через 15 минут
   * То есть каждые 15 минут система будет првоерять токен и обновлять его
   */
  expiresIn: number
  /**
   * Истечение рефреш токена через 7 дней
   * То есть каждые 7 дней пользователь должен перезаходить в систему
   */
  refreshExpiresIn: number
  user: Pick<UserModel, 'id' | 'email' | 'role' | 'status'>
}
