<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVariedadesStore, type CultivoVariedad } from '~/stores/variedades'
import { useCultivosStore } from '~/stores/cultivos'
import VariedadForm from './VariedadForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

const variedadesStore = useVariedadesStore()
const cultivosStore = useCultivosStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const variedadEnEdicion = ref<CultivoVariedad | null>(null)
const variedadAEliminar = ref<CultivoVariedad | null>(null)

const isLoading = computed(() => variedadesStore.loading)
const variedades = computed(() => variedadesStore.variedades)
const totalPages = computed(() => Math.ceil(variedadesStore.total / variedadesStore.pageSize))

watch(
  () => variedadesStore.currentPage,
  () => {
    variedadesStore.fetchVariedades()
  }
)

const inicializar = async () => {
  await cultivosStore.fetchCultivos()
  await variedadesStore.fetchVariedades()
}

const aplicarFiltros = async () => {
  variedadesStore.setCurrentPage(1)
  await variedadesStore.fetchVariedades()
}

const limpiarFiltros = () => {
  variedadesStore.filtros.q = ''
  variedadesStore.filtros.cultivoId = undefined
  variedadesStore.setCurrentPage(1)
  variedadesStore.fetchVariedades()
}

const abrirFormVariedad = () => {
  variedadEnEdicion.value = null
  mostrarForm.value = true
}

const editarVariedad = (variedad: CultivoVariedad) => {
  variedadEnEdicion.value = variedad
  mostrarForm.value = true
}

async function guardarVariedad(data: CultivoVariedad) {
  try {
    if (variedadEnEdicion.value?.id) {
      const { id: _, ...dataToUpdate } = data
      await variedadesStore.updateVariedad(variedadEnEdicion.value.id, dataToUpdate as CultivoVariedad)
    } else {
      await variedadesStore.createVariedad(data)
    }
    cerrarForm()
    await variedadesStore.fetchVariedades()
  } catch (error) {
    console.error('Error al guardar variedad:', error)
  }
}

const confirmarEliminar = (variedad: CultivoVariedad) => {
  variedadAEliminar.value = variedad
  mostrarConfirmarEliminar.value = true
}

const eliminarVariedad = async () => {
  if (!variedadAEliminar.value?.id) return
  try {
    await variedadesStore.deleteVariedad(variedadAEliminar.value.id)
    cancelarEliminar()
    await variedadesStore.fetchVariedades()
  } catch (error) {
    console.error('Error al eliminar variedad:', error)
  }
}

const cancelarEliminar = () => {
  variedadAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

const cerrarForm = () => {
  mostrarForm.value = false
  variedadEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPagesVal = Math.ceil(variedadesStore.total / variedadesStore.pageSize)
  if (page >= 1 && page <= totalPagesVal) {
    variedadesStore.setCurrentPage(page)
    await variedadesStore.fetchVariedades()
  }
}

inicializar()
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Variedades de Cultivos</h1>
        <p class="text-gray-600 dark:text-gray-400">Gestión de variedades y cultivares</p>
      </div>
      <button
        @click="abrirFormVariedad"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
      >
        ➕ Nueva Variedad
      </button>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Buscar variedad
          </label>
          <input
            v-model="variedadesStore.filtros.q"
            type="text"
            placeholder="Nombre de la variedad..."
            @keyup.enter="aplicarFiltros"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filtrar por cultivo
          </label>
          <select
            v-model.number="variedadesStore.filtros.cultivoId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">Todos los cultivos</option>
            <option v-for="cultivo in cultivosStore.cultivos" :key="cultivo.id" :value="cultivo.id">
              {{ cultivo.nombre }}
            </option>
          </select>
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
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Cultivo</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Características</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Estado</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading" class="text-center py-8">
            <td colspan="5" class="py-4">⏳ Cargando...</td>
          </tr>
          <tr v-else-if="variedades.length === 0" class="text-center py-8">
            <td colspan="5" class="py-4 text-gray-500 dark:text-gray-400">Sin variedades registradas</td>
          </tr>
          <tr v-for="variedad in variedades" :key="variedad.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {{ variedad.nombre }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ variedad.cultivo?.nombre || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
              {{ variedad.caracteristicas || '-' }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="variedad.esta_activo
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                "
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ variedad.esta_activo ? '✓ Activa' : '✕ Inactiva' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="editarVariedad(variedad)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Editar"
              >
                ✏️
              </button>
              <button
                @click="confirmarEliminar(variedad)"
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
      <div v-else-if="variedades.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Sin variedades registradas
      </div>
      <div
        v-for="variedad in variedades"
        :key="variedad.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">{{ variedad.nombre }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">{{ variedad.cultivo?.nombre }}</div>
            </div>
            <span
              :class="variedad.esta_activo
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              "
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ variedad.esta_activo ? '✓ Activa' : '✕ Inactiva' }}
            </span>
          </div>
          <div v-if="variedad.descripcion" class="text-sm text-gray-600 dark:text-gray-400">
            {{ variedad.descripcion }}
          </div>
          <div v-if="variedad.caracteristicas" class="text-sm">
            <span class="text-gray-600 dark:text-gray-400">Características:</span>
            <div class="text-gray-900 dark:text-white">{{ variedad.caracteristicas }}</div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="editarVariedad(variedad)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm transition"
          >
            ✏️ Editar
          </button>
          <button
            @click="confirmarEliminar(variedad)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-sm transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="variedades.length > 0" class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ (variedadesStore.currentPage - 1) * variedadesStore.pageSize + 1 }} a
        {{ Math.min(variedadesStore.currentPage * variedadesStore.pageSize, variedadesStore.total) }} de
        {{ variedadesStore.total }} variedades
      </div>
      <div class="flex gap-2">
        <button
          @click="irAPagina(variedadesStore.currentPage - 1)"
          :disabled="variedadesStore.currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="irAPagina(page)"
            :class="page === variedadesStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
            class="px-3 py-1 rounded transition"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="irAPagina(variedadesStore.currentPage + 1)"
          :disabled="variedadesStore.currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <VariedadForm
      v-if="mostrarForm"
      :variedad="variedadEnEdicion"
      @guardar="guardarVariedad"
      @cancelar="cerrarForm"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :item-name="`'${variedadAEliminar?.nombre}'`"
      @confirmar="eliminarVariedad"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

