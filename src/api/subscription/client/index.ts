import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

import { SubscriptionModel } from '../model'

export class ClientSubscriptionApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getCurrentSubscription(): Promise<SubscriptionModel> {
    const response = await this.client.get('/api/v1/subscription/current')

    return response.data
  }
}
