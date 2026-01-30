import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface AppSettings {
  // Configuración de medios
  maxVideoSeconds: number        // Máximo segundos de video (default 20)
  maxPhotoSizeMB: number         // Máximo tamaño foto en MB (default 5)
  maxVideoSizeMB: number         // Máximo tamaño video en MB (default 50)
  photoQuality: number           // Calidad de compresión (0.1 - 1.0)

  // Configuración offline
  autoSyncEnabled: boolean       // Sincronización automática
  syncIntervalMinutes: number    // Intervalo de sincronización

  // UI
  showSyncNotifications: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  maxVideoSeconds: 20,
  maxPhotoSizeMB: 5,
  maxVideoSizeMB: 50,
  photoQuality: 0.8,
  autoSyncEnabled: true,
  syncIntervalMinutes: 5,
  showSyncNotifications: true,
}

const STORAGE_KEY = 'tms_app_settings'

export const useSettingsStore = defineStore('settings', () => {
  // Estado
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })
  const isLoaded = ref(false)

  // Cargar settings desde localStorage
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        settings.value = { ...DEFAULT_SETTINGS, ...parsed }
      }
      isLoaded.value = true
    } catch (err) {
      console.error('Error cargando settings:', err)
      settings.value = { ...DEFAULT_SETTINGS }
      isLoaded.value = true
    }
  }

  // Guardar settings en localStorage
  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (err) {
      console.error('Error guardando settings:', err)
    }
  }

  // Actualizar un setting específico
  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    settings.value[key] = value
    saveSettings()
  }

  // Resetear a valores por defecto
  function resetToDefaults() {
    settings.value = { ...DEFAULT_SETTINGS }
    saveSettings()
  }

  // Watch para auto-guardar cambios
  watch(settings, () => {
    if (isLoaded.value) {
      saveSettings()
    }
  }, { deep: true })

  // Cargar al inicializar
  loadSettings()

  return {
    settings,
    isLoaded,
    loadSettings,
    saveSettings,
    updateSetting,
    resetToDefaults,
  }
})
