<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-6xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Roles</h1>
          <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Administra los roles del sistema
          </p>
        </div>
        <button
          @click="abrirFormRol()"
          class="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+</span> Nuevo Rol
        </button>
      </div>

      <!-- Búsqueda y Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
          <!-- Búsqueda (2 columnas) -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              v-model="rolesStore.filtros.q"
              type="text"
              placeholder="Por nombre o descripción..."
              @keyup.enter="aplicarFiltros"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            />
          </div>

          <!-- Ordenar por (1.5 columnas) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ordenar
            </label>
            <select
              v-model="rolesStore.filtros.sort"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            >
              <option value="nombre">Nombre</option>
              <option value="id">ID</option>
            </select>
          </div>

          <!-- Dirección (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orden
            </label>
            <select
              v-model="rolesStore.filtros.order"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-10"
            >
              <option value="ASC">▲ ASC</option>
              <option value="DESC">▼ DESC</option>
            </select>
          </div>

          <!-- Botón Aplicar (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              &nbsp;
            </label>
            <button
              @click="aplicarFiltros"
              class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm h-10"
            >
              ✓ Aplicar
            </button>
          </div>

          <!-- Botón Limpiar (1 columna) -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              &nbsp;
            </label>
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
      <div v-if="rolesStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="rolesStore.error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ rolesStore.error }}
      </div>

      <!-- Contenido: Tabla en desktop, Tarjetas en mobile -->
      <template v-else>
        <!-- Sin resultados -->
        <div
          v-if="rolesStore.roles.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">No hay roles disponibles</p>
          <button
            @click="abrirFormRol()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Crear el primer rol
          </button>
        </div>

        <!-- Tabla Desktop -->
        <div v-else class="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Nombre</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Descripción</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Usuarios</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="rol in rolesStore.roles"
                :key="rol.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{{ rol.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{{ rol.nombre }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {{ rol.descripcion || '-' }}
                </td>
                <td class="px-6 py-4 text-sm text-center">
                  <span class="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    {{ rol.usuariosCount ?? 0 }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm">
                  <button
                    @click="editarRol(rol)"
                    class="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium transition mr-2"
                  >
                    Editar
                  </button>
                  <button
                    @click="confirmarEliminar(rol)"
                    :disabled="(rol.usuariosCount ?? 0) > 0"
                    :class="[
                      'px-3 py-1 rounded text-xs font-medium transition',
                      (rol.usuariosCount ?? 0) > 0
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    ]"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tarjetas Mobile -->
        <div v-if="rolesStore.roles.length > 0" class="md:hidden space-y-3">
          <div
            v-for="rol in rolesStore.roles"
            :key="rol.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div class="flex justify-between items-start gap-3 mb-3">
              <div class="flex-1">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ rol.nombre }}</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">ID: {{ rol.id }}</p>
              </div>
              <span class="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                {{ rol.usuariosCount ?? 0 }} usuario(s)
              </span>
            </div>
            <p v-if="rol.descripcion" class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {{ rol.descripcion }}
            </p>
            <div class="flex gap-2">
              <button
                @click="editarRol(rol)"
                class="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-sm font-medium transition"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(rol)"
                :disabled="(rol.usuariosCount ?? 0) > 0"
                :class="[
                  'flex-1 px-3 py-2 rounded text-sm font-medium transition',
                  (rol.usuariosCount ?? 0) > 0
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                ]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="rolesStore.roles.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ (rolesStore.currentPage - 1) * rolesStore.pageSize + 1 }} a
            {{ Math.min(rolesStore.currentPage * rolesStore.pageSize, rolesStore.total) }} de
            {{ rolesStore.total }} roles
          </p>

          <div class="flex gap-2 flex-wrap justify-center">
            <button
              @click="irAPagina(rolesStore.currentPage - 1)"
              :disabled="rolesStore.currentPage === 1"
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
                  rolesStore.currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="irAPagina(rolesStore.currentPage + 1)"
              :disabled="rolesStore.currentPage >= rolesStore.total / rolesStore.pageSize"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal Crear/Editar -->
    <RoleForm
      v-if="mostrarForm"
      :rol="rolEnEdicion"
      @guardar="guardarRol"
      @cerrar="cerrarForm"
    />

    <!-- Modal Confirmación Eliminar -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :nombre="rolAEliminar?.nombre || ''"
      @confirmar="eliminarRol"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRolesStore, type Rol } from '~/stores/roles'
import RoleForm from './RoleForm.vue'
import ConfirmDeleteModal from '../common/ConfirmDeleteModal.vue'

const rolesStore = useRolesStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const rolEnEdicion = ref<Rol | null>(null)
const rolAEliminar = ref<Rol | null>(null)

const paginasVisibles = computed(() => {
  const totalPages = Math.ceil(rolesStore.total / rolesStore.pageSize)
  const current = rolesStore.currentPage
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
  await rolesStore.fetchRoles()
})

async function aplicarFiltros() {
  rolesStore.setCurrentPage(1)
  await rolesStore.fetchRoles()
}

function limpiarFiltros() {
  rolesStore.filtros.q = ''
  rolesStore.filtros.sort = 'id'
  rolesStore.filtros.order = 'ASC'
  rolesStore.setCurrentPage(1)
  rolesStore.fetchRoles()
}

function abrirFormRol() {
  rolEnEdicion.value = null
  mostrarForm.value = true
}

function editarRol(rol: Rol) {
  rolEnEdicion.value = rol
  mostrarForm.value = true
}

async function guardarRol(data: Rol) {
  try {
    if (rolEnEdicion.value?.id) {
      // En UPDATE, no enviar el id en el payload
      const { id, ...dataToUpdate } = data
      await rolesStore.updateRol(rolEnEdicion.value.id, dataToUpdate as Rol)
    } else {
      await rolesStore.createRol(data)
    }
    cerrarForm()
    await rolesStore.fetchRoles()
  } catch (error) {
    console.error('Error al guardar rol:', error)
  }
}

function confirmarEliminar(rol: Rol) {
  rolAEliminar.value = rol
  mostrarConfirmarEliminar.value = true
}

async function eliminarRol() {
  if (!rolAEliminar.value?.id) return

  try {
    await rolesStore.deleteRol(rolAEliminar.value.id)
    cancelarEliminar()
    await rolesStore.fetchRoles()
  } catch (error) {
    console.error('Error al eliminar rol:', error)
  }
}

function cancelarEliminar() {
  rolAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

function cerrarForm() {
  mostrarForm.value = false
  rolEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPages = Math.ceil(rolesStore.total / rolesStore.pageSize)
  if (page >= 1 && page <= totalPages) {
    rolesStore.setCurrentPage(page)
    await rolesStore.fetchRoles()
  }
}
</script>

