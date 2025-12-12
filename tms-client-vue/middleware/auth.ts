import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Rutas públicas
  const publicRoutes = ['/login', '/reset-password', '/']

  if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Si está autenticado y va a login, redirigir a home
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/')
  }
})

