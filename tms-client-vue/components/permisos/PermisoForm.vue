<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRolesStore } from '~/stores/roles'
import { usePermisosStore, type Permiso } from '~/stores/permisos'

const props = defineProps<{
  permiso?: Permiso | null
}>()

const emit = defineEmits<{
  guardar: [data: Permiso]
  cancelar: []
}>()

const rolesStore = useRolesStore()
const permisosStore = usePermisosStore()
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.permiso?.id)

const form = ref<Permiso>({
  rol_id: 0,
  recurso: '',
  accion: '',
  descripcion: null,
  activo: true,
})

watch(
  () => props.permiso,
  (newVal) => {
    if (newVal) {
      form.value = {
        rol_id: newVal.rol_id,
        recurso: newVal.recurso,
        accion: newVal.accion,
        descripcion: newVal.descripcion ?? null,
        activo: newVal.activo ?? true,
      }
    } else {
      form.value = {
        rol_id: 0,
        recurso: '',
        accion: '',
        descripcion: null,
        activo: true,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const validar = () => {
  errors.value = {}

  if (!form.value.rol_id) {
    errors.value.rol_id = 'Debe seleccionar un rol'
  }

  if (!form.value.recurso) {
    errors.value.recurso = 'Debe seleccionar un recurso'
  }

  if (!form.value.accion) {
    errors.value.accion = 'Debe seleccionar una acción'
  }

  return Object.keys(errors.value).length === 0
}

const guardar = () => {
  if (!validar()) return

  loading.value = true
  try {
    const { id, ...dataToSend } = form.value
    emit('guardar', {
      ...dataToSend,
      id: isEditing.value ? props.permiso!.id : undefined,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? '✏️ Editar Permiso' : '➕ Nuevo Permiso' }}
        </h2>
        <button
          @click="$emit('cancelar')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Formulario -->
      <div class="p-6 space-y-6">
        <!-- Rol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rol *
          </label>
          <select
            v-model.number="form.rol_id"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Seleccionar rol...</option>
            <option v-for="rol in rolesStore.roles" :key="rol.id" :value="rol.id">
              {{ rol.nombre }}
            </option>
          </select>
          <p v-if="errors.rol_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.rol_id }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Recurso -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recurso *
            </label>
            <select
              v-model="form.recurso"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar recurso...</option>
              <option v-for="recurso in permisosStore.recursosDisponibles" :key="recurso" :value="recurso">
                {{ recurso }}
              </option>
            </select>
            <p v-if="errors.recurso" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.recurso }}
            </p>
          </div>

          <!-- Acción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Acción *
            </label>
            <select
              v-model="form.accion"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar acción...</option>
              <option v-for="accion in permisosStore.accionesDisponibles" :key="accion" :value="accion">
                {{ accion }}
              </option>
            </select>
            <p v-if="errors.accion" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.accion }}
            </p>
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            v-model="form.descripcion"
            placeholder="Descripción del permiso (opcional)..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Estado -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado
          </label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.activo"
                type="radio"
                :value="true"
                class="w-4 h-4"
              />
              <span class="text-gray-700 dark:text-gray-300">Activo</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.activo"
                type="radio"
                :value="false"
                class="w-4 h-4"
              />
              <span class="text-gray-700 dark:text-gray-300">Inactivo</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
        <button
          @click="$emit('cancelar')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          ✕ Cancelar
        </button>
        <button
          @click="guardar"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? '⏳ Guardando...' : isEditing ? '💾 Actualizar' : '➕ Crear' }}
        </button>
      </div>
    </div>
  </div>
</template>

