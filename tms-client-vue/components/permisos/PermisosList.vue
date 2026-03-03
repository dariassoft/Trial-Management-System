<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePermisosStore, type Permiso } from '~/stores/permisos'
import { useRolesStore } from '~/stores/roles'
import { useApi } from '~/composables/useApi'
import PermisoForm from './PermisoForm.vue'
import ConfirmDeleteModal from '~/components/common/ConfirmDeleteModal.vue'

const permisosStore = usePermisosStore()
const rolesStore = useRolesStore()
const api = useApi()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const permisoEnEdicion = ref<Permiso | null>(null)
const permisoAEliminar = ref<Permiso | null>(null)
const inicializandoPermisos = ref(false)

const isLoading = computed(() => permisosStore.loading)
const permisos = computed(() => permisosStore.permisos)
const totalPages = computed(() => Math.ceil(permisosStore.total / permisosStore.pageSize))

watch(
  () => permisosStore.currentPage,
  () => {
    permisosStore.fetchPermisos()
  }
)

const inicializar = async () => {
  await rolesStore.fetchRoles()
  await permisosStore.fetchPermisos()
}

const inicializarPermisosDefault = async () => {
  if (!confirm('¿Estás seguro de que deseas inicializar los permisos por defecto para TODOS los roles? Esto no creará duplicados.')) {
    return
  }

  inicializandoPermisos.value = true
  try {
    const response = await api.post('/permisos/init', {})
    alert(`✅ Permisos inicializados correctamente!\n\nTotal de permisos creados: ${response.totalPermisosCreados}\nRoles procesados: ${response.rolesProcessados}`)
    await permisosStore.fetchPermisos()
  } catch (error) {
    alert('❌ Error al inicializar permisos')
    console.error(error)
  } finally {
    inicializandoPermisos.value = false
  }
}

const aplicarFiltros = async () => {
  permisosStore.setCurrentPage(1)
  await permisosStore.fetchPermisos()
}

const limpiarFiltros = () => {
  permisosStore.filtros.rol_id = undefined
  permisosStore.filtros.recurso = ''
  permisosStore.filtros.accion = ''
  permisosStore.setCurrentPage(1)
  permisosStore.fetchPermisos()
}

const abrirFormPermiso = () => {
  permisoEnEdicion.value = null
  mostrarForm.value = true
}

const editarPermiso = (permiso: Permiso) => {
  permisoEnEdicion.value = permiso
  mostrarForm.value = true
}

async function guardarPermiso(data: Permiso) {
  try {
    if (permisoEnEdicion.value?.id) {
      const { id: _, ...dataToUpdate } = data
      await permisosStore.updatePermiso(permisoEnEdicion.value.id, dataToUpdate as Permiso)
    } else {
      await permisosStore.createPermiso(data)
    }
    cerrarForm()
    await permisosStore.fetchPermisos()
  } catch (error) {
    console.error('Error al guardar permiso:', error)
  }
}

const confirmarEliminar = (permiso: Permiso) => {
  permisoAEliminar.value = permiso
  mostrarConfirmarEliminar.value = true
}

const eliminarPermiso = async () => {
  if (!permisoAEliminar.value?.id) return
  try {
    await permisosStore.deletePermiso(permisoAEliminar.value.id)
    cancelarEliminar()
    await permisosStore.fetchPermisos()
  } catch (error) {
    console.error('Error al eliminar permiso:', error)
  }
}

const cancelarEliminar = () => {
  permisoAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

const cerrarForm = () => {
  mostrarForm.value = false
  permisoEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPagesVal = Math.ceil(permisosStore.total / permisosStore.pageSize)
  if (page >= 1 && page <= totalPagesVal) {
    permisosStore.setCurrentPage(page)
    await permisosStore.fetchPermisos()
  }
}

inicializar()
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Permisos por Rol</h1>
        <p class="text-gray-600 dark:text-gray-400">Gestión granular de permisos y accesos</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <button
          @click="inicializarPermisosDefault"
          :disabled="inicializandoPermisos"
          class="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ inicializandoPermisos ? '⏳ Inicializando...' : '⚡ Inicializar Permisos' }}
        </button>
        <button
          @click="abrirFormPermiso"
          class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          ➕ Nuevo Permiso
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filtrar por rol
          </label>
          <select
            v-model.number="permisosStore.filtros.rol_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="undefined">Todos los roles</option>
            <option v-for="rol in rolesStore.roles" :key="rol.id" :value="rol.id">
              {{ rol.nombre }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filtrar por recurso
          </label>
          <select
            v-model="permisosStore.filtros.recurso"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option v-for="recurso in permisosStore.recursosDisponibles" :key="recurso" :value="recurso">
              {{ recurso }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filtrar por acción
          </label>
          <select
            v-model="permisosStore.filtros.accion"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option v-for="accion in permisosStore.accionesDisponibles" :key="accion" :value="accion">
              {{ accion }}
            </option>
          </select>
        </div>
        <button
          @click="aplicarFiltros"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          🔍 Filtrar
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
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Rol</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Recurso</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Acción</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Descripción</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Estado</th>
            <th class="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="isLoading" class="text-center py-8">
            <td colspan="6" class="py-4">⏳ Cargando...</td>
          </tr>
          <tr v-else-if="permisos.length === 0" class="text-center py-8">
            <td colspan="6" class="py-4 text-gray-500 dark:text-gray-400">Sin permisos registrados</td>
          </tr>
          <tr v-for="permiso in permisos" :key="permiso.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
              {{ permiso.rol?.nombre || '-' }}
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300">
              {{ permiso.recurso }}
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
                {{ permiso.accion }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
              {{ permiso.descripcion || '-' }}
            </td>
            <td class="px-4 py-3 text-center">
              <span
                :class="permiso.activo
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                "
                class="inline-block px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ permiso.activo ? '✓ Activo' : '✕ Inactivo' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center space-x-2">
              <button
                @click="editarPermiso(permiso)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                title="Editar"
              >
                ✏️
              </button>
              <button
                @click="confirmarEliminar(permiso)"
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
      <div v-else-if="permisos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Sin permisos registrados
      </div>
      <div
        v-for="permiso in permisos"
        :key="permiso.id"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
      >
        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">{{ permiso.rol?.nombre }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">{{ permiso.recurso }}</div>
            </div>
            <span class="inline-block px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium">
              {{ permiso.accion }}
            </span>
          </div>
          <div v-if="permiso.descripcion" class="text-sm text-gray-600 dark:text-gray-400">
            {{ permiso.descripcion }}
          </div>
          <div class="text-sm">
            <span
              :class="permiso.activo
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              "
              class="inline-block px-2 py-1 rounded text-xs font-medium"
            >
              {{ permiso.activo ? '✓ Activo' : '✕ Inactivo' }}
            </span>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="editarPermiso(permiso)"
            class="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm transition"
          >
            ✏️ Editar
          </button>
          <button
            @click="confirmarEliminar(permiso)"
            class="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-sm transition"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="permisos.length > 0" class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Mostrando {{ (permisosStore.currentPage - 1) * permisosStore.pageSize + 1 }} a
        {{ Math.min(permisosStore.currentPage * permisosStore.pageSize, permisosStore.total) }} de
        {{ permisosStore.total }} permisos
      </div>
      <div class="flex gap-2">
        <button
          @click="irAPagina(permisosStore.currentPage - 1)"
          :disabled="permisosStore.currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="page in Math.min(5, totalPages)"
            :key="page"
            @click="irAPagina(page)"
            :class="page === permisosStore.currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            "
            class="px-3 py-1 rounded transition"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="irAPagina(permisosStore.currentPage + 1)"
          :disabled="permisosStore.currentPage >= totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <PermisoForm
      v-if="mostrarForm"
      :permiso="permisoEnEdicion"
      @guardar="guardarPermiso"
      @cancelar="cerrarForm"
    />

    <!-- Modal de Confirmación de Eliminación -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :item-name="`permiso (${permisoAEliminar?.recurso} - ${permisoAEliminar?.accion})`"
      @confirmar="eliminarPermiso"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

