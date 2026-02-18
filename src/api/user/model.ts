export type UserModel = {
  id: string
  role?: UserRole
  password?: string | null
  fullName?: string | null
  email?: string | null
  actionUserId?: string | null
  status?: UserStatus | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  avatarUrl?: string | null
  statusMessage?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export enum UserRole {
  ADMIN = 'admin',
  /**
   * Пользователь, по сути не имеет доступа никуда
   */
  USER = 'user',
}
