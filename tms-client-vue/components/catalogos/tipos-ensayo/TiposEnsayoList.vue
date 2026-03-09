<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useTiposEnsayoStore, type TipoEnsayo } from '~/stores/tipos-ensayo'
import TipoEnsayoForm from './TipoEnsayoForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

const tiposStore = useTiposEnsayoStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const tipoEnEdicion = ref<TipoEnsayo | null>(null)
const tipoAEliminar = ref<TipoEnsayo | null>(null)

const isLoading = computed(() => tiposStore.loading)
const tipos = computed(() => tiposStore.tiposEnsayo)
const totalPages = computed(() => Math.ceil(tiposStore.total / tiposStore.pageSize))

watch(
  () => tiposStore.currentPage,
  () => {
    tiposStore.fetchTiposEnsayo()
  }
)

const inicializar = async () => {
  try {
    await tiposStore.fetchTiposEnsayo()
  } catch (error) {
    console.warn('No se pudieron cargar tipos de ensayo inicialmente:', error)
  }
}

const aplicarFiltros = async () => {
  tiposStore.setCurrentPage(1)
  await tiposStore.fetchTiposEnsayo()
}

const limpiarFiltros = () => {
  tiposStore.filtros.q = ''
  tiposStore.setCurrentPage(1)
  tiposStore.fetchTiposEnsayo()
}

const abrirFormTipo = () => {
  tipoEnEdicion.value = null
  mostrarForm.value = true
}

const editarTipo = (tipo: TipoEnsayo) => {
  tipoEnEdicion.value = tipo
  mostrarForm.value = true
}

async function guardarTipo(data: TipoEnsayo) {
  try {
    if (tipoEnEdicion.value?.id) {
      const { id: _, ...dataToUpdate } = data
      await tiposStore.updateTipo(tipoEnEdicion.value.id, dataToUpdate as TipoEnsayo)
    } else {
      await tiposStore.createTipo(data)
    }
    cerrarForm()
    await tiposStore.fetchTiposEnsayo()
  } catch (error) {
    console.error('Error al guardar tipo:', error)
  }
}

const confirmarEliminar = (tipo: TipoEnsayo) => {
  tipoAEliminar.value = tipo
  mostrarConfirmarEliminar.value = true
}

const eliminarTipo = async () => {
  if (!tipoAEliminar.value?.id) return
  try {
    await tiposStore.deleteTipo(tipoAEliminar.value.id)
    cancelarEliminar()
    await tiposStore.fetchTiposEnsayo()
  } catch (error) {
    console.error('Error al eliminar tipo:', error)
  }
}

const cancelarEliminar = () => {
  tipoAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

const cerrarForm = () => {
  mostrarForm.value = false
  tipoEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPagesVal = Math.ceil(tiposStore.total / tiposStore.pageSize)
  if (page >= 1 && page <= totalPagesVal) {
    tiposStore.setCurrentPage(page)
    await tiposStore.fetchTiposEnsayo()
  }
}

// Inicializar solo en el cliente, después del montaje
onMounted(() => {
  inicializar()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tipos de Ensayo</h1>
        <p class="text-gray-600 dark:text-gray-400">Gestión de clasificaciones de ensayos</p>
      </div>
      <button
        @click="abrirFormTipo"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
      >
        ➕ Nuevo Tipo
      </button>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar tipo
          </label>
          <input
            v-model="tiposStore.filtros.q"
            type="text"
            placeholder="Nombre del tipo de ensayo..."
            @keyup.enter="aplicarFiltros"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          @click="aplicarFiltros"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          🔍 Buscar
        </button>
        <button
          @click="limpiarFiltros"
          class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition"
        >
          ✕ Limpiar
        </button>
      </div>
    </div>

    <!-- Vista Tabla (Desktop) -->
    <div class="hidden md:block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Nombre</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Evaluación CSV</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Estado</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading" class="text-center py-8">
            <td colspan="5" class="py-4">⏳ Cargando...</td>
          </tr>
          <tr v-else-if="tipos.length === 0" class="text-center py-8">
            <td colspan="5" class="py-4 text-gray-500 dark:text-gray-400">Sin tipos de ensayo registrados</td>
          </tr>
          <tr v-for="tipo in tipos" :key="tipo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {{ tipo.nombre }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
              {{ tipo.descripcion || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300 text-xs">
              {{ tipo.evaluacionCsv || '-' }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="tipo.activo
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                "
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ tipo.activo ? '✓ Activo' : '✕ Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="editarTipo(tipo)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Editar"
              >
                ✏️
              </button>
              <button
                @click="confirmarEliminar(tipo)"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                title="Eliminar"
              >
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista Tarjetas (Mobile) -->
    <div class="md:hidden grid gap-3">
      <div v-if="isLoading" class="text-center py-8">⏳ Cargando...</div>
      <div v-else-if="tipos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Sin tipos de ensayo registrados
      </div>
      <div
        v-for="tipo in tipos"
        :key="tipo.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div class="font-bold text-gray-900 dark:text-white">{{ tipo.nombre }}</div>
            <span
              :class="tipo.activo
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              "
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ tipo.activo ? '✓ Activo' : '✕ Inactivo' }}
            </span>
          </div>
          <div v-if="tipo.descripcion" class="text-sm text-gray-600 dark:text-gray-400">
            {{ tipo.descripcion }}
          </div>
          <div v-if="tipo.evaluacionCsv" class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Evaluaciones (DDA):</span>
            <div class="text-gray-900 dark:text-white font-mono text-xs">{{ tipo.evaluacionCsv }}</div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="editarTipo(tipo)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm transition"
          >
            ✏️ Editar
          </button>
          <button
            @click="confirmarEliminar(tipo)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-sm transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="tipos.length > 0" class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ (tiposStore.currentPage - 1) * tiposStore.pageSize + 1 }} a
        {{ Math.min(tiposStore.currentPage * tiposStore.pageSize, tiposStore.total) }} de
        {{ tiposStore.total }} tipos
      </div>
      <div class="flex gap-2">
        <button
          @click="irAPagina(tiposStore.currentPage - 1)"
          :disabled="tiposStore.currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="irAPagina(page)"
            :class="page === tiposStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
            class="px-3 py-1 rounded transition"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="irAPagina(tiposStore.currentPage + 1)"
          :disabled="tiposStore.currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <TipoEnsayoForm
      v-if="mostrarForm"
      :tipo="tipoEnEdicion"
      @guardar="guardarTipo"
      @cancelar="cerrarForm"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :item-name="`'${tipoAEliminar?.nombre}'`"
      @confirmar="eliminarTipo"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

