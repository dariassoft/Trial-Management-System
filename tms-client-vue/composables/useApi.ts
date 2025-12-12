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
    get: (endpoint: string, options = {}) =>
      makeRequest(endpoint, { method: 'GET', ...options }),
    post: (endpoint: string, body?: any, options = {}) =>
      makeRequest(endpoint, { method: 'POST', body, ...options }),
    patch: (endpoint: string, body?: any, options = {}) =>
      makeRequest(endpoint, { method: 'PATCH', body, ...options }),
    delete: (endpoint: string, options = {}) =>
      makeRequest(endpoint, { method: 'DELETE', ...options }),
  }
}

