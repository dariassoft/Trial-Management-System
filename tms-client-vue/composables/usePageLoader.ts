import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function usePageLoader() {
  const router = useRouter()
  const isLoading = ref(false)

  async function navigateWithRetry(path: string, maxRetries = 3) {
    isLoading.value = true
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries} de navegar a: ${path}`)
        await router.push(path)
        isLoading.value = false
        return
      } catch (err: any) {
        lastError = err
        console.error(`❌ Intento ${attempt} falló:`, err.message)

        // Si es el último intento, lanzar el error
        if (attempt === maxRetries) {
          break
        }

        // Esperar antes de reintentar (exponencial backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.log(`⏳ Esperando ${delay}ms antes de reintentar...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    isLoading.value = false
    throw lastError
  }

  return {
    isLoading,
    navigateWithRetry
  }
}


