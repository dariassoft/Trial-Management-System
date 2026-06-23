export default defineNuxtPlugin((_nuxtApp) => {
  if (!process.client) return

  // Detectar si un mensaje de error corresponde a fallo de módulo dinámico de Nuxt
  function isNuxtPageModuleError(message: string): boolean {
    return message.includes('Failed to fetch dynamically imported module') &&
      message.includes('_nuxt/pages')
  }

  // Error síncrono (menos común para dynamic imports)
  window.addEventListener('error', (event: ErrorEvent) => {
    if (event.message && isNuxtPageModuleError(event.message)) {
      console.error('🚨 Error de carga de módulo dinámico:', event.message)
      if (navigator.onLine) {
        // Online: el módulo quedó desactualizado (HMR). Recargar limpia el caché.
        setTimeout(() => window.location.reload(), 500)
      } else {
        console.warn('📴 Sin conexión: no se puede cargar el módulo de página. Navega sólo a páginas ya visitadas.')
      }
    }
  })

  // Rechazo de promesa no capturado (caso habitual con dynamic import)
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason = event.reason
    // El reason puede ser un TypeError object o una string según el entorno
    const message: string =
      typeof reason === 'string'
        ? reason
        : (reason instanceof Error ? reason.message : String(reason ?? ''))

    if (isNuxtPageModuleError(message)) {
      event.preventDefault() // Evita que aparezca en la consola como "Uncaught"
      console.warn('⚠️ Módulo de página no disponible:', message)

      if (navigator.onLine) {
        // Online: versión del módulo desactualizada por HMR → recargar
        setTimeout(() => window.location.reload(), 500)
      } else {
        // Offline: el módulo no está en caché del navegador
        // En producción (build estático) esto no ocurre porque los chunks están pre-cargados
        console.warn('📴 Offline: no se puede cargar la página. Descarga el ensayo estando online antes de ir al campo.')
      }
    }
  })
})

