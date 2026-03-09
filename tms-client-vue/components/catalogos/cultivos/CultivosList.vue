<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCultivosStore, type Cultivo } from '~/stores/cultivos'
import CultivoForm from './CultivoForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

const cultivosStore = useCultivosStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const cultivoEnEdicion = ref<Cultivo | null>(null)
const cultivoAEliminar = ref<Cultivo | null>(null)

const isLoading = computed(() => cultivosStore.loading)
const cultivos = computed(() => cultivosStore.cultivos)
const totalPages = computed(() => Math.ceil(cultivosStore.total / cultivosStore.pageSize))

watch(
  () => cultivosStore.currentPage,
  () => {
    cultivosStore.fetchCultivos()
  }
)

const inicializar = async () => {
  try {
    await cultivosStore.fetchCultivos()
  } catch (error) {
    console.warn('No se pudieron cargar cultivos inicialmente:', error)
  }
}

const aplicarFiltros = async () => {
  cultivosStore.setCurrentPage(1)
  await cultivosStore.fetchCultivos()
}

const limpiarFiltros = () => {
  cultivosStore.filtros.q = ''
  cultivosStore.setCurrentPage(1)
  cultivosStore.fetchCultivos()
}

const abrirFormCultivo = () => {
  cultivoEnEdicion.value = null
  mostrarForm.value = true
}

const editarCultivo = (cultivo: Cultivo) => {
  cultivoEnEdicion.value = cultivo
  mostrarForm.value = true
}

async function guardarCultivo(data: Cultivo) {
  try {
    if (cultivoEnEdicion.value?.id) {
      const { id: _, ...dataToUpdate } = data
      await cultivosStore.updateCultivo(cultivoEnEdicion.value.id, dataToUpdate as Cultivo)
    } else {
      await cultivosStore.createCultivo(data)
    }
    cerrarForm()
    await cultivosStore.fetchCultivos()
  } catch (error) {
    console.error('Error al guardar cultivo:', error)
  }
}

const confirmarEliminar = (cultivo: Cultivo) => {
  cultivoAEliminar.value = cultivo
  mostrarConfirmarEliminar.value = true
}

const eliminarCultivo = async () => {
  if (!cultivoAEliminar.value?.id) return
  try {
    await cultivosStore.deleteCultivo(cultivoAEliminar.value.id)
    cancelarEliminar()
    await cultivosStore.fetchCultivos()
  } catch (error) {
    console.error('Error al eliminar cultivo:', error)
  }
}

const cancelarEliminar = () => {
  cultivoAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

const cerrarForm = () => {
  mostrarForm.value = false
  cultivoEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPagesVal = Math.ceil(cultivosStore.total / cultivosStore.pageSize)
  if (page >= 1 && page <= totalPagesVal) {
    cultivosStore.setCurrentPage(page)
    await cultivosStore.fetchCultivos()
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
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Cultivos</h1>
        <p class="text-gray-600 dark:text-gray-400">Catálogo de cultivos y especies agrícolas</p>
      </div>
      <button
        @click="abrirFormCultivo"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
      >
        ➕ Nuevo Cultivo
      </button>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar cultivo
          </label>
          <input
            v-model="cultivosStore.filtros.q"
            type="text"
            placeholder="Nombre del cultivo..."
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
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Ciclo Vegetativo</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Estado</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading" class="text-center py-8">
            <td colspan="5" class="py-4">⏳ Cargando...</td>
          </tr>
          <tr v-else-if="cultivos.length === 0" class="text-center py-8">
            <td colspan="5" class="py-4 text-gray-500 dark:text-gray-400">Sin cultivos registrados</td>
          </tr>
          <tr v-for="cultivo in cultivos" :key="cultivo.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {{ cultivo.nombre }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
              {{ cultivo.descripcion || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ cultivo.ciclo_vegetativo || '-' }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="cultivo.esta_activo
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                "
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ cultivo.esta_activo ? '✓ Activo' : '✕ Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="editarCultivo(cultivo)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Editar"
              >
                ✏️
              </button>
              <button
                @click="confirmarEliminar(cultivo)"
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
      <div v-else-if="cultivos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Sin cultivos registrados
      </div>
      <div
        v-for="cultivo in cultivos"
        :key="cultivo.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div class="font-bold text-gray-900 dark:text-white">{{ cultivo.nombre }}</div>
            <span
              :class="cultivo.esta_activo
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              "
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ cultivo.esta_activo ? '✓ Activo' : '✕ Inactivo' }}
            </span>
          </div>
          <div v-if="cultivo.descripcion" class="text-sm text-gray-600 dark:text-gray-400">
            {{ cultivo.descripcion }}
          </div>
          <div v-if="cultivo.ciclo_vegetativo" class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Ciclo:</span>
            <span class="text-gray-900 dark:text-white ml-2">{{ cultivo.ciclo_vegetativo }}</span>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="editarCultivo(cultivo)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm transition"
          >
            ✏️ Editar
          </button>
          <button
            @click="confirmarEliminar(cultivo)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-sm transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="cultivos.length > 0" class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ (cultivosStore.currentPage - 1) * cultivosStore.pageSize + 1 }} a
        {{ Math.min(cultivosStore.currentPage * cultivosStore.pageSize, cultivosStore.total) }} de
        {{ cultivosStore.total }} cultivos
      </div>
      <div class="flex gap-2">
        <button
          @click="irAPagina(cultivosStore.currentPage - 1)"
          :disabled="cultivosStore.currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="irAPagina(page)"
            :class="page === cultivosStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
            class="px-3 py-1 rounded transition"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="irAPagina(cultivosStore.currentPage + 1)"
          :disabled="cultivosStore.currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <CultivoForm
      v-if="mostrarForm"
      :cultivo="cultivoEnEdicion"
      @guardar="guardarCultivo"
      @cancelar="cerrarForm"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :item-name="`'${cultivoAEliminar?.nombre}'`"
      @confirmar="eliminarCultivo"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

