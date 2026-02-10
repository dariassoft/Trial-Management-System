import { useAuthStore } from '~/stores/auth'
import { useOfflineStore } from '~/stores/offline'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const offlineStore = useOfflineStore()

  // Rutas públicas
  const publicRoutes = ['/login', '/reset-password', '/']

  // Intentar inicializar offline store si no lo está
  if (process.client) {
    try {
      offlineStore.init().catch(err => console.warn('No se pudo inicializar offline store:', err))
    } catch (e) {
      console.warn('Error inicializando offline store:', e)
    }
  }

  if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Si está autenticado y va a login, redirigir a home
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})

