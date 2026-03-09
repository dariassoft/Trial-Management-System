export default defineNuxtPlugin((nuxtApp) => {
  // Manejar errores de importación dinámica
  if (process.client) {
    window.addEventListener('error', (event: ErrorEvent) => {
      if (event.message && event.message.includes('Failed to fetch dynamically imported module')) {
        console.error('🚨 Error de carga de módulo dinámico:', event.message)
        // El navegador recargará automáticamente la página, o podemos hacer:
        // window.location.reload()
      }
    })

    // Manejar rechazos de promesas no capturadas
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'string' && event.reason.includes('Failed to fetch')) {
        console.error('🚨 Error de fetch dinámico no capturado:', event.reason)
        // Intentar recargar la página o navegar de nuevo
        if (event.reason.includes('_nuxt/pages')) {
          console.warn('⚠️ Reintentando carga de página...')
          // Recargar después de un corto delay
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      }
    })
  }
})

