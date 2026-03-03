<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'
import { ref, computed, onMounted } from 'vue'
import StatsWidgets from '~/components/dashboard/StatsWidgets.vue'
import RecentEnsayos from '~/components/dashboard/RecentEnsayos.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({
  title: 'Dashboard - TMS',
})

const authStore = useAuthStore()
const api = useApi()
const ensayos = ref([])
const loading = ref(true)
const error = ref<string | null>(null)

const stats = computed(() => ({
  total: ensayos.value.length,
  activos: ensayos.value.length > 0 ? Math.floor(ensayos.value.length * 0.6) : 0,
  completados: ensayos.value.length > 0 ? Math.floor(ensayos.value.length * 0.3) : 0,
  pendientes: ensayos.value.length > 0 ? Math.floor(ensayos.value.length * 0.1) : 0,
}))

onMounted(async () => {
  try {
    // Cargar ensayos
    const response = await api.get('/ensayos?limit=100&page=1')

    // Manejar respuesta: puede ser un array directo o un objeto con data
    if (Array.isArray(response)) {
      ensayos.value = response
    } else if (response && response.data && Array.isArray(response.data)) {
      ensayos.value = response.data
    } else {
      ensayos.value = []
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Error al cargar ensayos'
    console.error('Error cargando ensayos:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Encabezado de bienvenida -->
    <div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Bienvenido, {{ authStore.user?.nombre }}</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-3">
        <span>Rol: <span class="font-semibold text-gray-900 dark:text-white">{{ authStore.userRole }}</span></span>
        <span class="mx-3">•</span>
        <span>Laboratorio: <span class="font-semibold text-gray-900 dark:text-white">{{ authStore.user?.laboratoriosAsignados?.[0]?.laboratorio?.nombre || 'Sin asignar' }}</span></span>
      </p>
    </div>

    <!-- Mensaje de error si existe -->
    <div v-if="error" class="rounded-lg bg-red-50 dark:bg-red-900 p-4 text-red-800 dark:text-red-200">
      ✗ {{ error }}
    </div>

    <!-- Stats Widgets -->
    <StatsWidgets :stats="stats" />

    <!-- Últimos Ensayos -->
    <RecentEnsayos />

    <!-- Información adicional para Super Admin -->
    <div v-if="authStore.userRole === 'Superadministrador'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Información del Sistema -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información del Sistema</h3>
        <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div class="flex justify-between">
            <span>Versión:</span>
            <span class="font-medium text-gray-900 dark:text-white">2.0.0</span>
          </div>
          <div class="flex justify-between">
            <span>Módulos activos:</span>
            <span class="font-medium text-gray-900 dark:text-white">8</span>
          </div>
          <div class="flex justify-between">
            <span>Usuarios activos:</span>
            <span class="font-medium text-gray-900 dark:text-white">12</span>
          </div>
          <div class="flex justify-between">
            <span>Última actualización:</span>
            <span class="font-medium text-gray-900 dark:text-white">Hoy</span>
          </div>
        </div>
      </div>

      <!-- Accesos Rápidos para Admin -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accesos Administrativos</h3>
        <div class="space-y-2">
          <NuxtLink
            to="/laboratorios"
            class="block px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 font-medium"
          >
            🔬 Gestionar Laboratorios
          </NuxtLink>
          <NuxtLink
            to="/admin/usuarios"
            class="block px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800 font-medium"
          >
            👥 Gestionar Usuarios
          </NuxtLink>
          <button
            class="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium"
          >
            ⚙️ Configuración del Sistema
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

