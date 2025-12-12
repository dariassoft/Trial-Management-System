<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ensayos</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Gestión de ensayos agronómicos</p>
      </div>
      <NuxtLink
        to="/ensayos/new"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        <span>+</span>
        <span>Nuevo Ensayo</span>
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre, responsable, laboratorio, variedad, cultivo, estado..."
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <input
        v-model="dateStart"
        type="date"
        placeholder="Fecha de siembra (inicio)"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-blue-200"
      />
      <input
        v-model="dateEnd"
        type="date"
        placeholder="Fecha de siembra (fin)"
        class="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-2 focus:ring-blue-200"
      />
    </div>

    <!-- Tabla de ensayos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="flex items-center justify-center">
          <div class="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-600 border-t-blue-600"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">Cargando ensayos...</span>
        </div>
      </div>

      <div v-else-if="ensayos.length === 0" class="p-8 text-center text-gray-500">
        <p>No se encontraron ensayos con los criterios de búsqueda</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortBy('nombreEnsayo')">
                Nombre {{ sortField === 'nombreEnsayo' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortBy('responsable.nombre')">
                Responsable {{ sortField === 'responsable.nombre' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Laboratorio</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Variedad</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortBy('fechaSiembra')">
                Fecha Siembra {{ sortField === 'fechaSiembra' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="sortBy('status')">
                Estado {{ sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
              </th>
              <th class="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="ensayo in ensayos" :key="ensayo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ ensayo.nombreEnsayo }}</td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ formatResponsable(ensayo.responsable) }}</td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ ensayo.laboratorio?.nombre || '-' }}</td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ ensayo.variedad?.nombre || '-' }}</td>
              <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ formatDate(ensayo.fechaSiembra) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(ensayo.status)">{{ ensayo.status }}</span>
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

      <!-- Paginación -->
      <div v-if="meta.total > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {{ ensayos.length }} de {{ meta.total }} ensayos
        </div>
        <div class="flex gap-2">
          <button @click="previousPage" :disabled="currentPage === 1" class="px-4 py-2 rounded-lg border">Anterior</button>
          <button @click="nextPage" :disabled="currentPage >= meta.pageCount" class="px-4 py-2 rounded-lg border">Siguiente</button>
        </div>
      </div>
    </div>
    
    <DeleteConfirm
      v-if="showDeleteDialog"
      :is-open="showDeleteDialog"
      :title="`¿Eliminar ensayo '${deleteEnsayoName}'?`"
      message="Esta acción eliminará permanentemente el ensayo y todos sus datos asociados."
      @confirm="confirmDelete"
      @cancel="closeDeleteDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import DeleteConfirm from '~/components/ensayos/DeleteConfirm.vue'
import type { Usuario } from '~/stores/ensayos';

const api = useApi()
const ensayos = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const dateStart = ref('')
const dateEnd = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const meta = ref({ total: 0, page: 1, limit: 10, pageCount: 0 })
const successMessage = ref('')
const errorMessage = ref('')
const showDeleteDialog = ref(false)
const deleteEnsayoId = ref<string | null>(null)
const deleteEnsayoName = ref('')
const sortField = ref<string>('nombreEnsayo')
const sortOrder = ref<'asc' | 'desc'>('asc')

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

const loadEnsayos = async () => {
  loading.value = true
  try {
    const params: Record<string, any> = {
      page: currentPage.value,
      limit: pageSize.value,
      sort: sortField.value,
      order: sortOrder.value.toUpperCase(),
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


    const response = await api.get('/ensayos', { params })
    ensayos.value = response.data || []
    meta.value = response.meta || { total: 0, page: 1, limit: 10, pageCount: 0 }

  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Error al cargar ensayos'
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < meta.value.pageCount) currentPage.value++
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const openDeleteDialog = (id: string, name: string) => {
  deleteEnsayoId.value = id
  deleteEnsayoName.value = name
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
}

const confirmDelete = async () => {
  if (!deleteEnsayoId.value) return
  try {
    await api.delete(`/ensayos/${deleteEnsayoId.value}`)
    successMessage.value = 'Ensayo eliminado correctamente'
    closeDeleteDialog()
    await loadEnsayos()
  } catch (error: any) {
    errorMessage.value = error.data?.message || 'Error al eliminar ensayo'
  }
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  currentPage.value = 1
}

watch([searchQuery, dateStart, dateEnd, currentPage, sortField, sortOrder], loadEnsayos)

onMounted(loadEnsayos)
</script>
