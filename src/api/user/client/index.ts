import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

import { UserModel } from '../model'

export class ClientUserApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getUsers(): Promise<{ list: UserModel[] }> {
    const response = await this.client.get('/api/v1/admin/users')

    return response.data
  }

  async getProfile(): Promise<UserModel> {
    const response = await this.client.get('/api/v1/user/profile')

    return response.data
  }
}
