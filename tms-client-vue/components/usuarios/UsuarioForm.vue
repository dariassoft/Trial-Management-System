<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full my-8">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
          <button
            @click="cerrar"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="guardar" class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              v-model="form.username"
              type="email"
              :disabled="isEditing"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <p v-if="errors.username" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.username }}</p>
          </div>

          <!-- Password (solo en creación o si se cambia) -->
          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña *
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Nombre y Apellido -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <input
                v-model="form.nombre"
                type="text"
                placeholder="Nombre"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apellido
              </label>
              <input
                v-model="form.apellido"
                type="text"
                placeholder="Apellido"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono *
            </label>
            <input
              v-model="form.telefono"
              type="tel"
              placeholder="Ej: 3875789133"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p v-if="errors.telefono" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.telefono }}</p>
          </div>

          <!-- Fecha de Nacimiento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              v-model="form.fecha_nacimiento"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol *
            </label>
            <select
              v-model.number="form.rolId"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option :value="undefined">Seleccionar rol...</option>
              <option v-for="rol in roles" :key="rol.id" :value="rol.id">
                {{ rol.nombre }}
              </option>
            </select>
            <p v-if="errors.rolId" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.rolId }}</p>
          </div>

          <!-- Laboratorios Asignados -->
          <div v-if="laboratorios.length > 0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Laboratorios Asignados
            </label>
            <div class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
              <label v-for="lab in laboratorios" :key="lab.id" class="flex items-center gap-2 cursor-pointer">
                <input
                  :checked="form.laboratorioIds?.includes(lab.id!)"
                  type="checkbox"
                  @change="e => toggleLaboratorio(lab.id!, (e.target as HTMLInputElement).checked)"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ lab.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- Estado Activo -->
          <div class="flex items-center gap-2">
            <input
              id="activo"
              v-model="form.esta_activo"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="activo" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Usuario activo
            </label>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="cerrar"
              class="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
            >
              {{ loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCatalogosStore } from '~/stores/catalogos'
import type { Usuario } from '~/stores/usuarios'

const props = defineProps<{
  usuario: Usuario | null
}>()

const emit = defineEmits<{
  guardar: [data: Usuario]
  cerrar: []
}>()

const catalogosStore = useCatalogosStore()
const loading = ref(false)
const form = ref<Usuario>({
  username: '',
  nombre: null,
  apellido: null,
  telefono: '',
  fecha_nacimiento: null,
  esta_activo: true,
  rolId: undefined,
  laboratorioIds: [],
})
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.usuario?.id)
const laboratorios = computed(() => catalogosStore.laboratorios || [])
const roles = computed(() => catalogosStore.roles || [])

onMounted(async () => {
  await Promise.all([
    catalogosStore.fetchLaboratorios(),
    catalogosStore.fetchRoles({ limit: 100 }), // Fetch all roles
  ])
})

watch(
  () => props.usuario,
  (newVal) => {
    if (newVal) {
      form.value = {
        username: newVal.username,
        nombre: newVal.nombre || null,
        apellido: newVal.apellido || null,
        telefono: newVal.telefono,
        fecha_nacimiento: newVal.fecha_nacimiento || null,
        esta_activo: newVal.esta_activo ?? true,
        rolId: newVal.rolId || newVal.rol?.id,
        laboratorioIds: newVal.laboratoriosAsignados?.map(ul => ul.laboratorio.id) || [],
      }
    } else {
      form.value = {
        username: '',
        nombre: null,
        apellido: null,
        telefono: '',
        fecha_nacimiento: null,
        esta_activo: true,
        rolId: undefined,
        laboratorioIds: [],
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function validar() {
  errors.value = {}

  if (!form.value.username) {
    errors.value.username = 'El email es requerido'
  }

  if (!isEditing.value && !form.value.password) {
    errors.value.password = 'La contraseña es requerida'
  }

  if (!form.value.telefono) {
    errors.value.telefono = 'El teléfono es requerido'
  }

  if (!form.value.rolId) {
    errors.value.rolId = 'El rol es requerido'
  }

  return Object.keys(errors.value).length === 0
}

function toggleLaboratorio(labId: number, checked: boolean) {
  if (!form.value.laboratorioIds) {
    form.value.laboratorioIds = []
  }
  if (checked) {
    if (!form.value.laboratorioIds.includes(labId)) {
      form.value.laboratorioIds.push(labId)
    }
  } else {
    form.value.laboratorioIds = form.value.laboratorioIds.filter(id => id !== labId)
  }
}

function guardar() {
  if (!validar()) return

  loading.value = true
  try {
    emit('guardar', {
      ...form.value,
      id: isEditing.value ? props.usuario!.id : undefined,
    })
  } finally {
    loading.value = false
  }
}

function cerrar() {
  emit('cerrar')
}
</script>
