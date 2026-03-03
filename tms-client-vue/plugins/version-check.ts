export default defineNuxtPlugin(() => {
  if (process.client) {
    const { init, cleanup } = useVersionCheck()

    init()

    // Cleanup cuando se desmonta la app
    if (process.client) {
      window.addEventListener('beforeunload', cleanup)
    }
  }
})

