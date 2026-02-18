import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

export class Request {
  private readonly client: AxiosInstance

  constructor(config?: CreateAxiosDefaults) {
    const { headers, baseURL, ...props } = config || {}

    this.client = axios.create({
      baseURL,
      headers: {
        Accept: '*/*',
        ...(headers as any),
      },
      withCredentials: true,
      ...props,
    })

    this.client.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        console.error('error', error)

        return Promise.reject(error)
      },
    )

    return this
  }

  get apiClient() {
    return this.client
  }
}
