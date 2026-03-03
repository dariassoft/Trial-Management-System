<template>
  <div
    v-if="showIndicator"
    class="fixed bottom-20 right-4 z-40"
  >
    <!-- Botón flotante -->
    <button
      @click="togglePanel"
      class="relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all"
      :class="buttonClass"
    >
      <!-- Icono -->
      <span class="text-2xl">{{ statusIcon }}</span>

      <!-- Badge de pendientes -->
      <span
        v-if="offlineStore.totalPending > 0"
        class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs
               rounded-full flex items-center justify-center font-bold"
      >
        {{ offlineStore.totalPending > 99 ? '99+' : offlineStore.totalPending }}
      </span>

      <!-- Indicador de sincronización -->
      <span
        v-if="offlineStore.isSyncing"
        class="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"
      ></span>
    </button>

    <!-- Panel expandido -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="showPanel"
        class="absolute bottom-16 right-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl
               border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <!-- Header -->
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="offlineStore.isOnline ? 'text-green-500' : 'text-red-500'">●</span>
            <span class="font-medium text-gray-900 dark:text-white">
              {{ offlineStore.isOnline ? 'En línea' : 'Sin conexión' }}
            </span>
          </div>
          <button
            @click="showPanel = false"
            class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <!-- Contenido -->
        <div class="p-4 space-y-3">
          <!-- Datos pendientes -->
          <div v-if="offlineStore.hasPendingData" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Mediciones pendientes</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ offlineStore.pendingMedicionesCount }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Archivos pendientes</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ offlineStore.pendingMediaCount }}
              </span>
            </div>
          </div>

          <div v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            ✅ Todo sincronizado
          </div>

          <!-- Última sincronización -->
          <div v-if="offlineStore.lastSyncTime" class="text-xs text-gray-500 dark:text-gray-400">
            Última sync: {{ formatLastSync }}
          </div>

          <!-- Error de sincronización -->
          <div v-if="offlineStore.syncError" class="text-xs text-red-500 bg-red-50 dark:bg-red-900/30 p-2 rounded">
            ⚠️ {{ offlineStore.syncError }}
          </div>

          <!-- Botón sincronizar -->
          <button
            v-if="offlineStore.hasPendingData && offlineStore.isOnline"
            @click="handleSync"
            :disabled="offlineStore.isSyncing"
            class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                   font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span v-if="offlineStore.isSyncing" class="animate-spin">⟳</span>
            <span>{{ offlineStore.isSyncing ? 'Sincronizando...' : 'Sincronizar ahora' }}</span>
          </button>

          <!-- Mensaje offline -->
          <div v-if="!offlineStore.isOnline && offlineStore.hasPendingData"
               class="text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded">
            📴 Los datos se sincronizarán cuando vuelva la conexión
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useOfflineStore } from '~/stores/offline'
import { useSettingsStore } from '~/stores/settings'
import { useApi } from '~/composables/useApi'

const offlineStore = useOfflineStore()
const settingsStore = useSettingsStore()
const api = useApi()

const showPanel = ref(false)
let syncInterval: ReturnType<typeof setInterval> | null = null

// Computed
const showIndicator = computed(() => {
  // Mostrar siempre si hay datos pendientes o está offline
  return !offlineStore.isOnline || offlineStore.hasPendingData || offlineStore.isSyncing
})

const buttonClass = computed(() => {
  if (offlineStore.isSyncing) {
    return 'bg-blue-500 text-white'
  }
  if (!offlineStore.isOnline) {
    return 'bg-red-500 text-white'
  }
  if (offlineStore.hasPendingData) {
    return 'bg-yellow-500 text-white'
  }
  return 'bg-green-500 text-white'
})

const statusIcon = computed(() => {
  if (offlineStore.isSyncing) return '🔄'
  if (!offlineStore.isOnline) return '📴'
  if (offlineStore.hasPendingData) return '⏳'
  return '✅'
})

const formatLastSync = computed(() => {
  if (!offlineStore.lastSyncTime) return 'Nunca'

  const diff = Date.now() - offlineStore.lastSyncTime
  const mins = Math.floor(diff / 60000)

  if (mins < 1) return 'Hace un momento'
  if (mins < 60) return `Hace ${mins} min`

  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Hace ${hours}h`

  return new Date(offlineStore.lastSyncTime).toLocaleDateString('es-AR')
})

// Métodos
function togglePanel() {
  showPanel.value = !showPanel.value
}

async function handleSync() {
  const result = await offlineStore.syncAll(api)

  if (result.success > 0) {
    console.log(`✅ ${result.success} elementos sincronizados`)
  }
  if (result.failed > 0) {
    console.log(`❌ ${result.failed} elementos fallaron`)
  }
}

// Auto-sincronización cuando vuelve la conexión
watch(() => offlineStore.isOnline, async (isOnline) => {
  if (isOnline && offlineStore.hasPendingData && settingsStore.settings.autoSyncEnabled) {
    console.log('🌐 Conexión restaurada, sincronizando...')
    await handleSync()
  }
})

// Sincronización periódica
function startAutoSync() {
  if (syncInterval) clearInterval(syncInterval)

  const intervalMs = settingsStore.settings.syncIntervalMinutes * 60 * 1000

  syncInterval = setInterval(async () => {
    if (offlineStore.isOnline && offlineStore.hasPendingData && settingsStore.settings.autoSyncEnabled) {
      await handleSync()
    }
  }, intervalMs)
}

onMounted(async () => {
  await offlineStore.init()
  startAutoSync()
})

onUnmounted(() => {
  if (syncInterval) {
    clearInterval(syncInterval)
  }
})
</script>
