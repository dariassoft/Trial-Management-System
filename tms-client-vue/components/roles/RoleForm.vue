<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Rol' : 'Nuevo Rol' }}
          </h2>
          <button
            @click="cerrar"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="guardar" class="p-6 space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Rol *
            </label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Ej: Administrador, Manager, Técnico"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Ejemplos: Superadministrador, Administrador, Manager, Técnico, Invitado
            </p>
            <p v-if="errors.nombre" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ errors.nombre }}</p>
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              v-model="form.descripcion"
              rows="4"
              placeholder="Describe los permisos y responsabilidades de este rol..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Máximo 500 caracteres</p>
          </div>

          <!-- Info en edición -->
          <div v-if="isEditing && rol?.usuariosCount" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p class="text-sm text-blue-800 dark:text-blue-200">
              <strong>{{ rol.usuariosCount }}</strong> usuario(s) asignado(s) a este rol
            </p>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
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
import { ref, computed, watch } from 'vue'
import type { Rol } from '~/stores/roles'

const props = defineProps<{
  rol: Rol | null
}>()

const emit = defineEmits<{
  guardar: [data: Rol]
  cerrar: []
}>()

const loading = ref(false)
const form = ref<Rol>({
  nombre: '',
  descripcion: null,
})
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.rol?.id)

watch(
  () => props.rol,
  (newVal) => {
    if (newVal) {
      form.value = {
        nombre: newVal.nombre,
        descripcion: newVal.descripcion || null,
      }
    } else {
      form.value = {
        nombre: '',
        descripcion: null,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

function validar() {
  errors.value = {}

  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es requerido'
  }

  if (form.value.descripcion && form.value.descripcion.length > 500) {
    errors.value.descripcion = 'La descripción no puede exceder 500 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

function guardar() {
  if (!validar()) return

  loading.value = true
  try {
    emit('guardar', {
      ...form.value,
      id: isEditing.value ? props.rol!.id : undefined,
    })
  } finally {
    loading.value = false
  }
}

function cerrar() {
  emit('cerrar')
}
</script>

