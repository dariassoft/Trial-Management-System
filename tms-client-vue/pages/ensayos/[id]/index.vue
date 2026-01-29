<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="flex items-center justify-center">
        <div class="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-600 border-t-blue-600"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-400">Cargando ensayo...</span>
      </div>
    </div>
    <!-- Contenido -->
    <div v-else-if="ensayo" class="grid gap-6">
      <!-- Información Básica -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Información Básica</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.nombreEnsayo }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Protocolo</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.protocolo?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tipo de Ensayo</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.tipoEnsayo?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Responsable</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatResponsable(ensayo.responsable) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Laboratorio</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.laboratorio?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Código Labor</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.codigoLabor || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Estado</p>
            <span :class="getStatusClass(ensayo.status?.nombre || '')">{{ ensayo.status?.nombre || '-' }}</span>
          </div>
        </div>
      </div>
      <!-- Ubicación -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ubicación</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Provincia</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.provincia || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Departamento</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.departamento || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Establecimiento</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.establecimiento || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Lote</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.lote || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Latitud</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.latitud || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Longitud</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.longitud || '-' }}</p>
          </div>
        </div>
      </div>
      <!-- Cultivo -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cultivo</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Especie</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.cultivo?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Variedad</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.variedad?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Tipo de Siembra</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.tipoSiembra?.nombre || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Distancia entre surcos</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ ensayo.distSurcosCm ? `${ensayo.distSurcosCm} cm` : '-' }}</p>
          </div>
        </div>
      </div>
      <!-- Fechas -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Fechas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Fecha de Inicio</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(ensayo.fechaInicio) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Fecha de Siembra</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(ensayo.fechaSiembra) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Fecha de Cosecha</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDate(ensayo.fechaCosecha) }}</p>
          </div>
        </div>
      </div>

      <!-- Bloques -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Diseño Experimental</h2>
        <BloquesList :ensayo-id="ensayo.id" :ensayo="ensayo" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ensayo, Usuario } from '~/stores/ensayos'
import BloquesList from '~/components/bloques/BloquesList.vue'

defineProps<{
  ensayo: Ensayo | null
  loading: boolean
}>()

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatResponsable = (responsable: Usuario | null): string => {
  if (!responsable) return '-';
  return `${responsable.apellido}, ${responsable.nombre}`;
}

const getStatusClass = (status: string) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
  switch (status) {
    case 'En Ejecución': return `${base} bg-green-100 text-green-800`;
    case 'Completado': return `${base} bg-blue-100 text-blue-800`;
    default: return `${base} bg-yellow-100 text-yellow-800`;
  }
}
</script>
