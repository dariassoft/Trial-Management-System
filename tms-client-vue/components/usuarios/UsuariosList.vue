<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 md:py-8">
    <div class="max-w-6xl mx-auto px-3 md:px-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          @click="abrirFormUsuario()"
          class="px-4 md:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      <!-- Búsqueda y Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
            <input
              v-model="usuariosStore.filtros.q"
              type="text"
              placeholder="Por email, nombre, teléfono..."
              @keyup.enter="aplicarFiltros"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            />
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ordenar</label>
            <select
              v-model="usuariosStore.filtros.sort"
              class="w-full px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base h-10"
            >
              <option value="username">Email</option>
              <option value="id">ID</option>
            </select>
          </div>

          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orden</label>
            <select
              v-model="usuariosStore.filtros.order"
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
      <div v-if="usuariosStore.loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="usuariosStore.error"
        class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6 text-red-600 dark:text-red-200"
      >
        {{ usuariosStore.error }}
      </div>

      <!-- Contenido -->
      <template v-else>
        <div
          v-if="usuariosStore.usuarios.length === 0"
          class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
        >
          <p class="text-gray-600 dark:text-gray-400 mb-4">No hay usuarios disponibles</p>
          <button
            @click="abrirFormUsuario()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
          >
            Crear el primer usuario
          </button>
        </div>

        <!-- Tabla Desktop -->
        <div v-else class="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 dark:bg-gray-700 border-b">
              <tr>
                <th class="px-6 py-3 text-left font-semibold">Email</th>
                <th class="px-6 py-3 text-left font-semibold">Nombre</th>
                <th class="px-6 py-3 text-left font-semibold">Rol</th>
                <th class="px-6 py-3 text-left font-semibold">Teléfono</th>
                <th class="px-6 py-3 text-center font-semibold">Activo</th>
                <th class="px-6 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="usuario in usuariosStore.usuarios"
                :key="usuario.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-6 py-4 font-medium">{{ usuario.username }}</td>
                <td class="px-6 py-4">{{ usuario.nombre || usuario.apellido ? `${usuario.nombre || ''} ${usuario.apellido || ''}` : '-' }}</td>
                <td class="px-6 py-4 text-sm">
                  <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {{ usuario.rol?.nombre || '-' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">{{ usuario.telefono || '-' }}</td>
                <td class="px-6 py-4 text-center">
                  <span :class="[
                    'px-2 py-1 rounded text-xs font-medium',
                    usuario.esta_activo
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  ]">
                    {{ usuario.esta_activo ? '✓ Activo' : '✕ Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    @click="editarUsuario(usuario)"
                    class="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-medium mr-2"
                  >
                    Editar
                  </button>
                  <button
                    @click="confirmarEliminar(usuario)"
                    class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tarjetas Mobile -->
        <div v-if="usuariosStore.usuarios.length > 0" class="md:hidden space-y-3">
          <div
            v-for="usuario in usuariosStore.usuarios"
            :key="usuario.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <div class="mb-3">
              <h3 class="font-bold text-gray-900 dark:text-white">{{ usuario.username }}</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ usuario.nombre }} {{ usuario.apellido }}
              </p>
            </div>
            <div class="space-y-1 mb-3 text-sm">
              <p><strong>Rol:</strong> {{ usuario.rol?.nombre }}</p>
              <p><strong>Teléfono:</strong> {{ usuario.telefono || '-' }}</p>
              <p><strong>Estado:</strong>
                <span :class="usuario.esta_activo ? 'text-green-600' : 'text-red-600'">
                  {{ usuario.esta_activo ? 'Activo' : 'Inactivo' }}
                </span>
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="editarUsuario(usuario)"
                class="flex-1 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded text-sm font-medium"
              >
                Editar
              </button>
              <button
                @click="confirmarEliminar(usuario)"
                class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="usuariosStore.usuarios.length > 0" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {{ (usuariosStore.currentPage - 1) * usuariosStore.pageSize + 1 }} a
            {{ Math.min(usuariosStore.currentPage * usuariosStore.pageSize, usuariosStore.total) }} de
            {{ usuariosStore.total }} usuarios
          </p>

          <div class="flex gap-2 flex-wrap justify-center">
            <button
              @click="irAPagina(usuariosStore.currentPage - 1)"
              :disabled="usuariosStore.currentPage === 1"
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
                  usuariosStore.currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="irAPagina(usuariosStore.currentPage + 1)"
              :disabled="usuariosStore.currentPage >= usuariosStore.total / usuariosStore.pageSize"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal Crear/Editar -->
    <UsuarioForm
      v-if="mostrarForm"
      :usuario="usuarioEnEdicion"
      @guardar="guardarUsuario"
      @cerrar="cerrarForm"
    />

    <!-- Modal Confirmación Eliminar -->
    <ConfirmDeleteModal
      v-if="mostrarConfirmarEliminar"
      :nombre="usuarioAEliminar?.username || ''"
      @confirmar="eliminarUsuario"
      @cancelar="cancelarEliminar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsuariosStore, type Usuario } from '~/stores/usuarios'
import UsuarioForm from './UsuarioForm.vue'
import ConfirmDeleteModal from '../common/ConfirmDeleteModal.vue'

const usuariosStore = useUsuariosStore()
const mostrarForm = ref(false)
const mostrarConfirmarEliminar = ref(false)
const usuarioEnEdicion = ref<Usuario | null>(null)
const usuarioAEliminar = ref<Usuario | null>(null)

const paginasVisibles = computed(() => {
  const totalPages = Math.ceil(usuariosStore.total / usuariosStore.pageSize)
  const current = usuariosStore.currentPage
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
  await usuariosStore.fetchUsuarios()
})

async function aplicarFiltros() {
  usuariosStore.setCurrentPage(1)
  await usuariosStore.fetchUsuarios()
}

function limpiarFiltros() {
  usuariosStore.filtros.q = ''
  usuariosStore.setCurrentPage(1)
  usuariosStore.fetchUsuarios()
}

function abrirFormUsuario() {
  usuarioEnEdicion.value = null
  mostrarForm.value = true
}

function editarUsuario(usuario: Usuario) {
  usuarioEnEdicion.value = usuario
  mostrarForm.value = true
}

async function guardarUsuario(data: Usuario) {
  try {
    if (usuarioEnEdicion.value?.id) {
      // En UPDATE, no enviar el id en el payload
      const { id, ...dataToUpdate } = data
      await usuariosStore.updateUsuario(usuarioEnEdicion.value.id, dataToUpdate as Usuario)
    } else {
      await usuariosStore.createUsuario(data)
    }
    cerrarForm()
    await usuariosStore.fetchUsuarios()
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  }
}

function confirmarEliminar(usuario: Usuario) {
  usuarioAEliminar.value = usuario
  mostrarConfirmarEliminar.value = true
}

async function eliminarUsuario() {
  if (!usuarioAEliminar.value?.id) return

  try {
    await usuariosStore.deleteUsuario(usuarioAEliminar.value.id)
    cancelarEliminar()
    await usuariosStore.fetchUsuarios()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}

function cancelarEliminar() {
  usuarioAEliminar.value = null
  mostrarConfirmarEliminar.value = false
}

function cerrarForm() {
  mostrarForm.value = false
  usuarioEnEdicion.value = null
}

async function irAPagina(page: number) {
  const totalPages = Math.ceil(usuariosStore.total / usuariosStore.pageSize)
  if (page >= 1 && page <= totalPages) {
    usuariosStore.setCurrentPage(page)
    await usuariosStore.fetchUsuarios()
  }
}
</script>

