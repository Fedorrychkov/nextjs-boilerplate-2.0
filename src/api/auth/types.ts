import { UserRole } from '../user'

export type LoginEmailDto = {
  email: string
  password: string
}

/**
 * Базовая регистрация пользователя
 * Может использоваться для регистрации сотрудника овнером
 * Для админа отдельная DTO и endpoint
 */
export type RegisterDto = {
  email: string
  phone?: string | null
  fullName?: string | null
  password: string
}

export type RegisterByAdminDto = RegisterDto & {
  role: UserRole
}
