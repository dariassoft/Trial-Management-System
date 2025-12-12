import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.rol?.nombre || null)

  // Cargar auth desde localStorage
  const initializeAuth = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  // Login
  const login = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password },
      })

      token.value = response.accessToken
      user.value = response.user

      // Guardar en localStorage
      if (process.client) {
        localStorage.setItem('token', response.accessToken)
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      return response
    } catch (err: any) {
      error.value = err.data?.message || 'Error al iniciar sesión'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    token.value = null
    user.value = null
    error.value = null

    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  // Reset password (placeholder - implementar según API)
  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Implementar endpoint de reset password en el backend
      // await $fetch(`${apiBase}/auth/reset-password`, { ... })
      console.log('Reset password para:', email)
      return { success: true }
    } catch (err: any) {
      error.value = err.data?.message || 'Error al resetear contraseña'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userRole,
    initializeAuth,
    login,
    logout,
    resetPassword,
  }
})

