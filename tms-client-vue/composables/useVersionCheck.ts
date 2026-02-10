import { ref, onMounted, watch } from 'vue'
import { useOfflineStore } from '~/stores/offline'

let versionCheckInterval: ReturnType<typeof setInterval> | null = null
let notificationTimeout: ReturnType<typeof setTimeout> | null = null

export const useVersionCheck = () => {
  const currentVersion = ref<string | null>(null)
  const newVersionAvailable = ref(false)
  const offlineStore = useOfflineStore()

  const checkVersion = async () => {
    if (!process.client) return

    // Si está offline, no hacer nada
    if (!offlineStore.isOnline) return

    try {
      const response = await fetch('/version.json', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) return

      const data = await response.json()
      const newVersion = data.version

      if (currentVersion.value === null) {
        // Primera carga: guardar versión
        currentVersion.value = newVersion
        localStorage.setItem('app-version', newVersion)
      } else if (currentVersion.value !== newVersion) {
        // Nueva versión detectada
        console.log(`🔄 Nueva versión disponible: ${newVersion} (actual: ${currentVersion.value})`)
        newVersionAvailable.value = true
        currentVersion.value = newVersion
        localStorage.setItem('app-version', newVersion)

        // Auto-reload después de 5 segundos si está seguro
        if (isSafeToReload()) {
          scheduleAutoReload()
        }
      }
    } catch (error) {
      console.warn('Error verificando versión:', error)
    }
  }

  const isSafeToReload = (): boolean => {
    // NO recargar si:
    // 1. Hay datos pendientes de sincronización
    // 2. El usuario está en formulario
    // 3. Está offline

    if (!offlineStore.isOnline) return false
    if (offlineStore.hasPendingData) return false

    // Verificar que no hay inputs activos
    const activeElement = document.activeElement as HTMLElement
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      return false
    }

    return true
  }

  const scheduleAutoReload = () => {
    // Cancelar timeout anterior si existe
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }

    // Esperar 3 segundos antes de recargar
    notificationTimeout = setTimeout(() => {
      forceReload()
    }, 3000)
  }

  const forceReload = () => {
    console.log('♻️ Recargando aplicación con nueva versión...')
    // Usar location.reload(true) para forzar bypass de cache
    window.location.href = window.location.href.split('#')[0]
    // Fallback si href no funciona
    setTimeout(() => {
      location.reload()
    }, 500)
  }

  const cancelAutoReload = () => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
      notificationTimeout = null
    }
  }

  const init = () => {
    if (!process.client) return

    // Restaurar versión guardada
    const savedVersion = localStorage.getItem('app-version')
    if (savedVersion) {
      currentVersion.value = savedVersion
    }

    // Check inicial
    checkVersion()

    // Luego cada 60 segundos
    if (versionCheckInterval) {
      clearInterval(versionCheckInterval)
    }
    versionCheckInterval = setInterval(checkVersion, 60000)

    // También check cuando recupera conectividad
    watch(() => offlineStore.isOnline, (isOnline) => {
      if (isOnline) {
        // Delay pequeño para asegurar que hay conectividad real
        setTimeout(checkVersion, 500)
      }
    })
  }

  const cleanup = () => {
    if (versionCheckInterval) {
      clearInterval(versionCheckInterval)
      versionCheckInterval = null
    }
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
      notificationTimeout = null
    }
  }

  return {
    currentVersion,
    newVersionAvailable,
    checkVersion,
    forceReload,
    cancelAutoReload,
    init,
    cleanup,
    isSafeToReload
  }
}

