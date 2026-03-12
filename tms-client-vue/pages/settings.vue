
<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          ⚙️ Configuración
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Ajustes de la aplicación
        </p>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-3xl mx-auto px-4 py-6 space-y-6">

      <!-- Sección: Notificaciones -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🔔 Notificaciones
          </h2>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hora de generación de notificaciones diarias
            </label>
            <select v-model.number="settings.notificationHour" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option v-for="hour in 24" :key="hour" :value="hour - 1">{{ (hour - 1).toString().padStart(2, '0') }}:00</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sección: Captura de Medios -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📸 Captura de Fotos y Videos
          </h2>
        </div>
        <div class="p-4 space-y-4">
          <!-- Máximo segundos de video -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración máxima de video (segundos)
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model.number="settings.maxVideoSeconds"
                min="5"
                max="60"
                step="5"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span class="w-16 text-center font-medium text-gray-900 dark:text-white">
                {{ settings.maxVideoSeconds }}s
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              El video se detendrá automáticamente al alcanzar este límite
            </p>
          </div>

          <!-- Máximo tamaño de foto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño máximo de foto (MB)
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model.number="settings.maxPhotoSizeMB"
                min="1"
                max="20"
                step="1"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span class="w-16 text-center font-medium text-gray-900 dark:text-white">
                {{ settings.maxPhotoSizeMB }} MB
              </span>
            </div>
          </div>

          <!-- Máximo tamaño de video -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamaño máximo de video (MB)
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model.number="settings.maxVideoSizeMB"
                min="10"
                max="200"
                step="10"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span class="w-16 text-center font-medium text-gray-900 dark:text-white">
                {{ settings.maxVideoSizeMB }} MB
              </span>
            </div>
          </div>

          <!-- Calidad de foto -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Calidad de compresión de fotos
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model.number="settings.photoQuality"
                min="0.3"
                max="1"
                step="0.1"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span class="w-16 text-center font-medium text-gray-900 dark:text-white">
                {{ Math.round(settings.photoQuality * 100) }}%
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mayor calidad = archivos más grandes
            </p>
          </div>
        </div>
      </div>

      <!-- Sección: Sincronización Offline -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🔄 Sincronización Offline
          </h2>
        </div>
        <div class="p-4 space-y-4">
          <!-- Auto-sync habilitado -->
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-700 dark:text-gray-300">
                Sincronización automática
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Sincronizar datos cuando vuelva la conexión
              </p>
            </div>
            <button
              @click="settings.autoSyncEnabled = !settings.autoSyncEnabled"
              :class="settings.autoSyncEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="settings.autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- Intervalo de sincronización -->
          <div v-if="settings.autoSyncEnabled">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Intervalo de sincronización (minutos)
            </label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model.number="settings.syncIntervalMinutes"
                min="1"
                max="30"
                step="1"
                class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span class="w-16 text-center font-medium text-gray-900 dark:text-white">
                {{ settings.syncIntervalMinutes }} min
              </span>
            </div>
          </div>

          <!-- Notificaciones de sync -->
          <div class="flex items-center justify-between">
            <div>
              <label class="font-medium text-gray-700 dark:text-gray-300">
                Mostrar notificaciones
              </label>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Avisar cuando se sincronicen datos
              </p>
            </div>
            <button
              @click="settings.showSyncNotifications = !settings.showSyncNotifications"
              :class="settings.showSyncNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
              class="relative w-12 h-6 rounded-full transition-colors"
            >
              <span
                :class="settings.showSyncNotifications ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
              ></span>
            </button>
          </div>

          <!-- Estado actual -->
          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Estado de conexión</span>
              <span :class="offlineStore.isOnline ? 'text-green-500' : 'text-red-500'" class="font-medium">
                {{ offlineStore.isOnline ? '🟢 En línea' : '🔴 Sin conexión' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-sm mt-2">
              <span class="text-gray-600 dark:text-gray-400">Datos pendientes</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ offlineStore.totalPending }} elementos
              </span>
            </div>
          </div>

          <!-- Botón sincronizar -->
          <button
            v-if="offlineStore.hasPendingData && offlineStore.isOnline"
            @click="handleSync"
            :disabled="offlineStore.isSyncing"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                   font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span v-if="offlineStore.isSyncing" class="animate-spin">⟳</span>
            {{ offlineStore.isSyncing ? 'Sincronizando...' : 'Sincronizar ahora' }}
          </button>
        </div>
      </div>

      <!-- Sección: Acciones -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🛠️ Acciones
          </h2>
        </div>
        <div class="p-4 space-y-3">
          <!-- Limpiar caché -->
          <button
            @click="cleanupOldData"
            class="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                   dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg
                   font-medium transition flex items-center justify-center gap-2"
          >
            🗑️ Limpiar datos antiguos sincronizados
          </button>

          <!-- Restaurar valores por defecto -->
          <button
            @click="resetToDefaults"
            class="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                   dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg
                   font-medium transition flex items-center justify-center gap-2"
          >
            ↩️ Restaurar valores por defecto
          </button>
        </div>
      </div>

      <!-- Información de la app -->
      <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
        <p>TMS - Trial Management System</p>
        <p>Versión 1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '~/stores/settings'
import { useOfflineStore } from '~/stores/offline'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

const settingsStore = useSettingsStore()
const offlineStore = useOfflineStore()
const api = useApi()

const settings = computed(() => settingsStore.settings)

async function handleSync() {
  const result = await offlineStore.syncAll(api)
  alert(`Sincronización completada: ${result.success} exitosos, ${result.failed} fallidos`)
}

async function cleanupOldData() {
  const deleted = await offlineStore.cleanupOldData()
  alert(`Se eliminaron ${deleted} registros antiguos`)
}

function resetToDefaults() {
  if (confirm('¿Restaurar todos los ajustes a sus valores por defecto?')) {
    settingsStore.resetToDefaults()
    alert('Ajustes restaurados')
  }
}

useHead({
  title: 'Configuración - TMS',
})
</script>
