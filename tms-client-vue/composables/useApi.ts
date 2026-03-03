import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const authStore = useAuthStore()

  const makeRequest = async (
    endpoint: string,
    options: any = {}
  ) => {
    const headers = options.headers || {}

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }

    try {
      const response = await $fetch(endpoint, {
        baseURL: apiBase,
        ...options,
        headers,
      })
      return response
    } catch (error: any) {
      // Si es error 401, limpiar auth
      if (error.status === 401) {
        authStore.logout()
        navigateTo('/login')
      }
      throw error
    }
  }

  return {
    apiBase,
    makeRequest,
    get: (endpoint: string, options: any = {}) => {
      // Si hay params, construir query string
      if (options.params) {
        const queryParams = new URLSearchParams()
        Object.entries(options.params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value))
          }
        })
        const queryString = queryParams.toString()
        if (queryString) {
          endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`
        }
        delete options.params
      }
      return makeRequest(endpoint, { method: 'GET', ...options })
    },
    post: (endpoint: string, body?: any, options = {}) =>
      makeRequest(endpoint, { method: 'POST', body, ...options }),
    patch: (endpoint: string, body?: any, options = {}) =>
      makeRequest(endpoint, { method: 'PATCH', body, ...options }),
    put: (endpoint: string, body?: any, options = {}) =>
      makeRequest(endpoint, { method: 'PUT', body, ...options }),
    delete: (endpoint: string, options = {}) =>
      makeRequest(endpoint, { method: 'DELETE', ...options }),
  }
}

