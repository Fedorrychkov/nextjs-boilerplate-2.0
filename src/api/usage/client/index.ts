import { Request } from '@lib/request'
import { AxiosInstance } from 'axios'

import { PaginationResponse } from '~/types'

import { UsageModel } from '../model'

export class ClientUsageApi {
  private readonly client: AxiosInstance

  constructor() {
    this.client = new Request().apiClient
  }

  async getUsageHistory(): Promise<PaginationResponse<UsageModel>> {
    const response = await this.client.get('/api/v1/usage/history')

    return response.data
  }

  async getTotalUsageTokens(): Promise<{ totalTokens: number }> {
    const response = await this.client.get('/api/v1/usage/total-tokens')

    return response.data
  }
}
