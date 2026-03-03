export default defineRouteMiddleware((to, from) => {
  // Este middleware mapea rutas dinámicas sin caracteres especiales
  // /ensayos/:id → show.vue
  // /ensayos/:id/edit → edit.vue
  
  const ensayosPattern = /^\/ensayos\/(\d+)(\/edit)?$/
  const match = to.path.match(ensayosPattern)
  
  if (match) {
    const id = match[1]
    const isEdit = match[2] === '/edit'
    
    // Pasar el parámetro a través de route.params
    if (!to.params.id) {
      to.params.id = id
    }
  }
})

