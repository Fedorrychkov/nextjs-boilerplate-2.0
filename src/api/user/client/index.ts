import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

export class ClientUserApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }
}
