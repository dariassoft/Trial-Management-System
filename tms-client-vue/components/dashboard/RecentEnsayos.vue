<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ensayos Recientes</h3>
    </div>
    
    <!-- Filtros -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre, responsable, laboratorio, variedad, estado..."
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          v-model="dateStart"
          type="date"
          placeholder="Fecha de siembra (inicio)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          v-model="dateEnd"
          type="date"
          placeholder="Fecha de siembra (fin)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Responsable</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Laboratorio</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Variedad</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Fecha Siembra</th>
            <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Estado</th>
            <th class="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loading">
            <td colspan="7" class="p-8 text-center">Cargando...</td>
          </tr>
          <tr v-else-if="ensayos.length === 0">
            <td colspan="7" class="p-8 text-center text-gray-500">No se encontraron ensayos.</td>
          </tr>
          <tr v-for="ensayo in ensayos" :key="ensayo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td class="px-6 py-4 font-medium">{{ ensayo.nombreEnsayo }}</td>
            <td class="px-6 py-4">{{ formatResponsable(ensayo.responsable) }}</td>
            <td class="px-6 py-4">{{ ensayo.laboratorio?.nombre || '-' }}</td>
            <td class="px-6 py-4">{{ ensayo.variedad?.nombre || '-' }}</td>
            <td class="px-6 py-4">{{ formatDate(ensayo.fechaSiembra) }}</td>
            <td class="px-6 py-4">
              <span :class="getStatusClass(ensayo.status?.nombre || '')">
                {{ ensayo.status?.nombre || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 text-center whitespace-nowrap">
              <NuxtLink
                :to="`/ensayos/${ensayo.id}`"
                class="inline-flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 mr-2"
              >
                👁️ Ver
              </NuxtLink>
              <NuxtLink
                :to="`/ensayos/${ensayo.id}/edit`"
                class="inline-flex items-center gap-1 rounded bg-yellow-100 dark:bg-yellow-900 px-3 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 mr-2"
              >
                ✏️ Editar
              </NuxtLink>
              <button
                @click="openDeleteDialog(ensayo.id, ensayo.nombreEnsayo)"
                class="inline-flex items-center gap-1 rounded bg-red-100 dark:bg-red-900 px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800"
              >
                🗑️ Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="p-6 text-right">
      <NuxtLink to="/ensayos" class="text-blue-600 hover:text-blue-800 font-medium">Ver todos los Ensayos →</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useEnsayosStore, type Usuario } from '~/stores/ensayos'
import { storeToRefs } from 'pinia'

const ensayosStore = useEnsayosStore()
const { ensayos, loading } = storeToRefs(ensayosStore)

const searchQuery = ref('')
const dateStart = ref('')
const dateEnd = ref('')

const formatDate = (date: string | Date): string => {
  if (!date) return '-'

  // If it's a string in ISO format (YYYY-MM-DD), parse it without timezone conversion
  if (typeof date === 'string' && date.includes('-')) {
    const parts = date.split('T')[0].split('-'); // Get YYYY-MM-DD part
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`; // Return as DD/MM/YYYY
    }
  }

  // Fallback to Date object parsing
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

const formatResponsable = (responsable: Usuario | null): string => {
  if (!responsable) return '-';
  return `${responsable.apellido}, ${responsable.nombre}`;
}

const getStatusClass = (status: string) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';
  switch (status) {
    case 'En Ejecución': return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    case 'Completado': return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    default: return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
  }
}

const loadEnsayos = () => {
  const params: Record<string, any> = {
    limit: 5,
    page: 1,
    sort: 'fechaSiembra',
    order: 'DESC',
  };

  if (searchQuery.value) {
    params.q = searchQuery.value;
  }

  if (dateStart.value) {
    params.fechaSiembraStart = dateStart.value;
  }
  if (dateEnd.value) {
    params.fechaSiembraEnd = dateEnd.value;
  }

  ensayosStore.fetchEnsayos(params);
}

// Dummy functions for delete actions to prevent template errors
const openDeleteDialog = (id: string, name: string) => {
  console.log('Open delete dialog for:', id, name);
  // Implement actual delete dialog logic if needed for dashboard
}

watch([searchQuery, dateStart, dateEnd], loadEnsayos)

onMounted(loadEnsayos)
</script>
