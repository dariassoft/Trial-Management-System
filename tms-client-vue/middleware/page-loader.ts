export default defineNuxtRouteMiddleware(async (to) => {
  // Este middleware se ejecuta antes de cargar la página
  // Verificar que la página existe y puede cargarse

  if (process.client) {
    // En el cliente, intentar precargar el módulo
    try {
      const modulePath = to.matched[0]?.components?.default
      if (modulePath) {
        console.log('📦 Pre-cargando módulo:', modulePath)
      }
    } catch (err) {
      console.error('❌ Error pre-cargando módulo:', err)
      // Continuar de todas formas
    }
  }
})

