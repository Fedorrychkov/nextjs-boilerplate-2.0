import { Request } from '@lib/request'
import { AxiosHeaders, AxiosInstance } from 'axios'

import { UserModel } from '~/api/user'

import { LoginEmailDto, RegisterByAdminDto, RegisterDto } from '../types'

export class ClientAuthApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async login(body: LoginEmailDto): Promise<{ success: boolean; message?: string }> {
    const response = await this.client.post('/api/v1/auth/login', body)

    return response.data
  }

  async refreshToken(): Promise<{ success: string }> {
    const response = await this.client.post('/api/v1/auth/refresh')

    return response.data
  }

  async logout(): Promise<void> {
    const response = await this.client.post('/api/v1/auth/logout')

    return response.data
  }

  async profile(): Promise<Pick<UserModel, 'id' | 'email' | 'role' | 'status'>> {
    const response = await this.client.get('/api/v1/auth/profile')

    return response.data
  }

  async registerByAdmin(body: RegisterByAdminDto): Promise<Pick<UserModel, 'id' | 'email' | 'role' | 'status'>> {
    const response = await this.client.post('/api/v1/auth/register-by-admin', body)

    return response.data
  }

  async signUp(
    body: RegisterDto,
    headers?: AxiosHeaders,
  ): Promise<{
    success: boolean
    message: string
    user: Pick<UserModel, 'id' | 'email' | 'role' | 'status'>
  }> {
    const response = await this.client.post('/api/v1/auth/sign-up', body, { headers })

    return response.data
  }
}
