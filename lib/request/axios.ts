import { clearAllAuthCookies } from '@lib/cookies'
import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

export class Request {
  private readonly client: AxiosInstance
  private readonly isServerRequest: boolean

  constructor(config?: CreateAxiosDefaults) {
    const { headers, baseURL, ...props } = config || {}

    // Определяем, это серверный запрос или клиентский
    // Серверные запросы имеют baseURL (к бэкенду), клиентские - нет (к /api)
    this.isServerRequest = !!baseURL

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
          if (this.isServerRequest) {
            // Для серверных запросов (BFF) - не делаем ничего
            // Куки будут очищены в API роутах при необходимости
            console.warn('Server request received 401 - cookies should be cleared in API route')

            try {
              if (error.response?.res) {
                clearAllAuthCookies(error?.response?.res)
              }
            } catch (clearError) {
              console.error('Error clearing cookies on server:', clearError)
            }

            // ВАЖНО: Возвращаем 401 ошибку, чтобы API route мог её обработать
            return Promise.reject({
              ...error,
              status: 401,
              message: 'Authentication required',
              cookiesCleared: true,
            })
          } else {
            // Для клиентских запросов - вызываем logout API и редиректим
            try {
              await this.client.post('/api/v1/auth/logout')
            } catch (logoutError) {
              console.error('Failed to logout:', logoutError)
            }

            // Перенаправляем на страницу логина
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
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
