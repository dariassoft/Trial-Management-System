<template>
  <div class="space-y-4">
    <!-- Encabezado con búsqueda y botón crear -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, responsable o cultivo..."
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <button
        @click="emit('create')"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <span>+</span>
        <span>Nuevo Ensayo</span>
      </button>
    </div>

    <!-- Tabla de ensayos -->
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="w-full text-sm">
        <thead class="border-b bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Responsable</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Cultivo</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Variedad</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Fecha Siembra</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Estado</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700">Ubicación</th>
            <th class="px-6 py-3 text-center font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-if="loading" class="border-b">
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">
              <div class="flex items-center justify-center">
                <div class="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                <span class="ml-2">Cargando ensayos...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="filteredEnsayos.length === 0" class="border-b">
            <td colspan="8" class="px-6 py-8 text-center text-gray-500">
              <p>{{ searchQuery ? 'No se encontraron ensayos con los criterios de búsqueda' : 'No hay ensayos registrados' }}</p>
            </td>
          </tr>

          <tr v-for="ensayo in filteredEnsayos" :key="ensayo.id" class="border-b hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ ensayo.nombreEnsayo }}
            </td>
            <td class="px-6 py-4 text-gray-700">
              {{ ensayo.responsable || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-700">
              {{ ensayo.cultivoEspecie || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-700">
              {{ ensayo.cultivoVariedad || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-700">
              {{ formatDateForDisplay(ensayo.fechaSiembra) }}
            </td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(ensayo.status?.nombre || '')">
                {{ ensayo.status?.nombre || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-700">
              <div class="text-xs">
                <div>{{ ensayo.provincia }}</div>
                <div class="text-gray-500">{{ ensayo.departamento }}</div>
              </div>
            </td>
            <td class="space-x-2 px-6 py-4 text-center">
              <button
                @click="emit('view', ensayo.id)"
                class="inline-flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
              >
                👁️ Ver
              </button>
              <button
                @click="emit('edit', ensayo.id)"
                class="inline-flex items-center gap-1 rounded bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200"
              >
                ✏️ Editar
              </button>
              <button
                @click="emit('delete', ensayo.id)"
                class="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
              >
                🗑️ Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="total > pageSize" class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, total) }} de {{ total }} ensayos
      </div>
      <div class="flex gap-2">
        <button
          @click="emit('previous-page')"
          :disabled="currentPage === 1"
          class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <span class="text-sm text-gray-700">Página {{ currentPage }}</span>
        </div>
        <button
          @click="emit('next-page')"
          :disabled="currentPage * pageSize >= total"
          class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
        >
          Siguiente →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ensayo } from '~/stores/ensayos'
import { useEnsayos } from '~/composables/useEnsayos'

const props = defineProps<{
  ensayos: Ensayo[]
  loading: boolean
  currentPage: number
  pageSize: number
  total: number
}>()

const emit = defineEmits<{
  create: []
  view: [id: string]
  edit: [id: string]
  delete: [id: string]
  'next-page': []
  'previous-page': []
}>()

const { searchQuery, filteredEnsayos, formatDateForDisplay } = useEnsayos()

const getStatusClass = (status: string) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium'
  switch (status?.toLowerCase()) {
    case 'en ejecución':
      return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
    case 'completado':
      return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
    case 'pendiente':
      return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
    case 'cancelado':
      return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
    default:
      return `${base} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
  }
}
</script>

