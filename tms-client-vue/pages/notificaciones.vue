<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🔔 Notificaciones
            </h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ notificacionesStore.unreadCount }} sin leer
            </p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="notificacionesStore.unreadCount > 0"
              @click="notificacionesStore.markAllAsRead()"
              class="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ✓ Marcar todas leídas
            </button>
            <button
              @click="handleForceGenerate"
              :disabled="generating"
              class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <span v-if="generating">⟳ Generando...</span>
              <span v-else>🔄 Generar notificaciones</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto px-4 py-6">
      <!-- Loading -->
      <div v-if="notificacionesStore.loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Cargando notificaciones...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="notificacionesStore.notifications.length === 0" class="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="text-5xl mb-4">🔕</div>
        <p class="text-gray-500 dark:text-gray-400 text-lg">No hay notificaciones</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">
          Las notificaciones se generan automáticamente cada día a las 8:00 AM
        </p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div
          v-for="notification in notificacionesStore.notifications"
          :key="notification.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-l-4 transition-all"
          :class="[
            notification.leido
              ? 'border-gray-300 dark:border-gray-600 opacity-75'
              : 'border-blue-500'
          ]"
        >
          <div class="flex justify-between items-start gap-3">
            <!-- Left: icon + content -->
            <div class="flex gap-3 flex-1 min-w-0">
              <!-- Type icon -->
              <div class="text-2xl flex-shrink-0 mt-0.5">
                {{ tipoIcon(notification.tipo) }}
              </div>
              <!-- Text -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3
                    class="font-semibold text-gray-900 dark:text-white"
                    :class="{ 'font-bold': !notification.leido }"
                  >
                    {{ notification.titulo }}
                  </h3>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="tipoBadgeClass(notification.tipo)"
                  >
                    {{ tipoLabel(notification.tipo) }}
                  </span>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {{ notification.descripcion }}
                </p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="text-xs text-gray-400 dark:text-gray-500">
                    {{ formatDate(notification.createdAt) }}
                  </span>
                  <NuxtLink
                    v-if="notification.link"
                    :to="notification.link"
                    class="text-xs text-blue-500 hover:text-blue-700 hover:underline font-medium"
                  >
                    Ver detalles →
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Right: actions -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="toggleRead(notification)"
                class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :title="notification.leido ? 'Marcar como no leída' : 'Marcar como leída'"
              >
                <svg v-if="!notification.leido" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51" />
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </button>
              <button
                @click="notificacionesStore.deleteNotification(notification.id)"
                class="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                title="Eliminar notificación"
              >
                <svg class="w-5 h-5 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificacionesStore, type Notificacion } from '~/stores/notificaciones'
import { onMounted, ref } from 'vue'

const notificacionesStore = useNotificacionesStore()
const generating = ref(false)

onMounted(() => {
  notificacionesStore.fetchNotifications()
})

function toggleRead(notification: Notificacion) {
  if (notification.leido) {
    notificacionesStore.markAsUnread(notification.id)
  } else {
    notificacionesStore.markAsRead(notification.id)
  }
}

async function handleForceGenerate() {
  generating.value = true
  try {
    await notificacionesStore.forceGenerate()
  } catch {
    // error already logged in store
  } finally {
    generating.value = false
  }
}

function tipoIcon(tipo: string): string {
  const icons: Record<string, string> = {
    siembra: '🌱',
    cosecha: '🌾',
    medicion: '📏',
    info_incompleta: '⚠️',
    resumen_semanal: '📋',
    general: '📌',
  }
  return icons[tipo] || '📌'
}

function tipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    siembra: 'Siembra',
    cosecha: 'Cosecha',
    medicion: 'Medición',
    info_incompleta: 'Incompleto',
    resumen_semanal: 'Resumen',
    general: 'General',
  }
  return labels[tipo] || 'General'
}

function tipoBadgeClass(tipo: string): string {
  const classes: Record<string, string> = {
    siembra: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cosecha: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    medicion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    info_incompleta: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    resumen_semanal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    general: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  }
  return classes[tipo] || classes.general
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'Ahora mismo'
  if (diffMin < 60) return `Hace ${diffMin} min`
  if (diffHrs < 24) return `Hace ${diffHrs}h`
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
