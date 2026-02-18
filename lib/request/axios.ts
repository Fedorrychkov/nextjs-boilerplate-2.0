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
      // TODO: Эта правка может быть не нужной совсем, поэтому пока закомментировал
      // // Добавляем SSL конфигурацию для решения проблем с сертификатами
      // httpsAgent: new (require('https').Agent)({
      //   rejectUnauthorized: !isDevelop ? true : false,
      // }),
      ...props,
    })

    this.client.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        console.error('error', error)

        /**
         * При 401 ошибке обрабатываем logout по-разному для клиента и сервера
         */
        if (error?.status === 401 || error?.response?.status === 401) {
          // Перенаправляем на страницу логина
          if (typeof window !== 'undefined') {
            window.location.href = '/logout'
          }
        }

        return Promise.reject(error)
      },
    )

    return this
  }

  get apiClient() {
    return this.client
  }
}
