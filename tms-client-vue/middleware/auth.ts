import { useAuthStore } from '~/stores/auth'
import { useOfflineStore } from '~/stores/offline'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const offlineStore = useOfflineStore()

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/login', '/reset-password', '/']

  // Inicializar autenticación desde localStorage si no lo está
  if (process.client && !authStore.token) {
    authStore.initializeAuth()
  }

  // Intentar inicializar offline store de forma segura
  // (sin bloquear el flujo de autenticación si hay errores)
  if (process.client) {
    try {
      offlineStore.init().catch((err: any) => {
        console.warn('Advertencia: No se pudo inicializar offline store:', err?.message || err)
      })
    } catch (e: any) {
      console.warn('Advertencia: Error inicializando offline store:', e?.message || e)
    }
  }

  // Proteger rutas: redirigir a login si no está autenticado
  if (!publicRoutes.includes(to.path) && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Si está autenticado y va a login, redirigir a home
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})

