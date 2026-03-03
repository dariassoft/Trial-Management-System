<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-6xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Laboratorios</h1>
          <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Administra los laboratorios del sistema
          </p>
        </div>
        <button
          @click="abrirFormLaboratorio()"
          class="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+</span> Nuevo Laboratorio
        </button>
      </div>

      <!-- Búsqueda y Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              v-model="laboratoriosStore.filtros.q"
              type="text"
              placeholder="Por nombre, email, contacto..."
              @keyup.enter="aplicarFiltros"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            />
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ordenar</label>
            <select
              v-model="laboratoriosStore.filtros.sort"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            >
              <option value="nombre">Nombre</option>
              <option value="id">ID</option>
            </select>
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orden</label>
            <select
              v-model="laboratoriosStore.filtros.order"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-10"
            >
              <option value="ASC">▲ ASC</option>
              <option value="DESC">▼ DESC</option>
            </select>
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">&nbsp;</label>
            <button
              @click="aplicarFiltros"
              class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm h-10"
            >
              ✓ Aplicar
            </button>
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">&nbsp;</label>
            <button
              @click="limpiarFiltros"
              class="w-full px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition text-sm h-10"
            >
              ✕ Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Cargando -->
      <div v-if="laboratoriosStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="laboratoriosStore.error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ laboratoriosStore.error }}
      </div>

      <!-- Contenido -->
      <template v-else>
        <div
          v-if="laboratoriosStore.laboratorios.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">No hay laboratorios disponibles</p>
          <button
            @click="abrirFormLaboratorio()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Crear el primer laboratorio
          </button>
        </div>

        <!-- Tarjetas -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="lab in laboratoriosStore.laboratorios"
            :key="lab.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition overflow-hidden"
          >
            <div class="p-4">
              <div class="flex justify-between items-start gap-3 mb-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {{ lab.nombre }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">ID: {{ lab.id }}</p>
                </div>
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium flex-shrink-0',
                    lab.esta_activo
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  ]"
                >
                  {{ lab.esta_activo ? '✓ Activo' : '✕ Inactivo' }}
                </span>
              </div>

              <div v-if="lab.descripcion" class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {{ lab.descripcion }}
              </div>

              <div class="space-y-1 text-sm mb-3">
                <div v-if="lab.email" class="text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {{ lab.email }}
                </div>
                <div v-if="lab.telefono" class="text-gray-700 dark:text-gray-300">
                  <strong>Teléfono:</strong> {{ lab.telefono }}
                </div>
                <div v-if="lab.contacto" class="text-gray-700 dark:text-gray-300">
                  <strong>Contacto:</strong> {{ lab.contacto }}
                </div>
                <div v-if="lab.direccion" class="text-gray-700 dark:text-gray-300 line-clamp-1">
                  <strong>Dirección:</strong> {{ lab.direccion }}
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="px-4 pb-3 flex gap-2 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="editarLaboratorio(lab)"
                class="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-sm font-medium transition"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(lab)"
                class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="laboratoriosStore.laboratorios.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ (laboratoriosStore.currentPage - 1) * laboratoriosStore.pageSize + 1 }} a
            {{ Math.min(laboratoriosStore.currentPage * laboratoriosStore.pageSize, laboratoriosStore.total) }} de
            {{ laboratoriosStore.total }} laboratorios
          </p>

          <div class="flex gap-2 flex-wrap justify-center">
            <button
              @click="irAPagina(laboratoriosStore.currentPage - 1)"
              :disabled="laboratoriosStore.currentPage === 1"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ← Anterior
            </button>

            <div class="flex gap-1">
              <button
                v-for="page in paginasVisibles"
                :key="page"
                @click="irAPagina(page)"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition',
                  laboratoriosStore.currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="irAPagina(laboratoriosStore.currentPage + 1)"
              :disabled="laboratoriosStore.currentPage >= laboratoriosStore.total / laboratoriosStore.pageSize"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal Crear/Editar -->
    <LaboratorioForm
      v-if="mostrarForm"
      :laboratorio="laboratorioEnEdicion"
      @guardar="guardarLaboratorio"
      @cerrar="cerrarForm"
    />

    <!-- Modal Confirmación Eliminar -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :nombre="laboratorioAEliminar?.nombre || ''"
      @confirmar="eliminarLaboratorio"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLaboratoriosStore, type Laboratorio } from '~/stores/laboratorios'
import LaboratorioForm from './LaboratorioForm.vue'
import ConfirmDeleteModal from '../common/ConfirmDeleteModal.vue'

const laboratoriosStore = useLaboratoriosStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const laboratorioEnEdicion = ref<Laboratorio | null>(null)
const laboratorioAEliminar = ref<Laboratorio | null>(null)

const paginasVisibles = computed(() => {
  const totalPages = Math.ceil(laboratoriosStore.total / laboratoriosStore.pageSize)
  const current = laboratoriosStore.currentPage
  const pages: number[] = []
  const maxPages = 5

  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (current <= 3) {
      for (let i = 1; i <= maxPages; i++) pages.push(i)
    } else if (current >= totalPages - 2) {
      for (let i = totalPages - maxPages + 1; i <= totalPages; i++) pages.push(i)
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i)
    }
  }

  return pages
})

onMounted(async () => {
  await laboratoriosStore.fetchLaboratorios()
})

async function aplicarFiltros() {
  laboratoriosStore.setCurrentPage(1)
  await laboratoriosStore.fetchLaboratorios()
}

function limpiarFiltros() {
  laboratoriosStore.filtros.q = ''
  laboratoriosStore.filtros.sort = 'id'
  laboratoriosStore.filtros.order = 'ASC'
  laboratoriosStore.setCurrentPage(1)
  laboratoriosStore.fetchLaboratorios()
}

function abrirFormLaboratorio() {
  laboratorioEnEdicion.value = null
  mostrarForm.value = true
}

function editarLaboratorio(lab: Laboratorio) {
  laboratorioEnEdicion.value = lab
  mostrarForm.value = true
}

async function guardarLaboratorio(data: Laboratorio) {
  try {
    if (laboratorioEnEdicion.value?.id) {
      // En UPDATE, no enviar el id en el payload
      const { id, ...dataToUpdate } = data
      await laboratoriosStore.updateLaboratorio(laboratorioEnEdicion.value.id, dataToUpdate as Laboratorio)
    } else {
      // En CREATE, se puede enviar (aunque no se usa)
      await laboratoriosStore.createLaboratorio(data)
    }
    cerrarForm()
    await laboratoriosStore.fetchLaboratorios()
  } catch (error) {
    console.error('Error al guardar laboratorio:', error)
  }
}

function confirmarEliminar(lab: Laboratorio) {
  laboratorioAEliminar.value = lab
  mostrarConfirmarEliminar.value = true
}

async function eliminarLaboratorio() {
  if (!laboratorioAEliminar.value?.id) return

  try {
    await laboratoriosStore.deleteLaboratorio(laboratorioAEliminar.value.id)
    cancelarEliminar()
    await laboratoriosStore.fetchLaboratorios()
  } catch (error) {
    console.error('Error al eliminar laboratorio:', error)
  }
}

function cancelarEliminar() {
  laboratorioAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

function cerrarForm() {
  mostrarForm.value = false
  laboratorioEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPages = Math.ceil(laboratoriosStore.total / laboratoriosStore.pageSize)
  if (page >= 1 && page <= totalPages) {
    laboratoriosStore.setCurrentPage(page)
    await laboratoriosStore.fetchLaboratorios()
  }
}
</script>

