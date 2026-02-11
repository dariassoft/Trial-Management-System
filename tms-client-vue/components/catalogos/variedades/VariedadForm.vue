<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCultivosStore } from '~/stores/cultivos'
import type { CultivoVariedad } from '~/stores/variedades'

const props = defineProps<{
  variedad?: CultivoVariedad | null
}>()

const emit = defineEmits<{
  guardar: [data: CultivoVariedad]
  cancelar: []
}>()

const cultivosStore = useCultivosStore()
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const isEditing = computed(() => !!props.variedad?.id)

const form = ref<CultivoVariedad>({
  nombre: '',
  descripcion: null,
  caracteristicas: null,
  esta_activo: true,
  cultivo_id: 0,
})

watch(
  () => props.variedad,
  (newVal) => {
    if (newVal) {
      form.value = {
        nombre: newVal.nombre,
        descripcion: newVal.descripcion ?? null,
        caracteristicas: newVal.caracteristicas ?? null,
        esta_activo: newVal.esta_activo ?? true,
        cultivo_id: newVal.cultivo_id,
      }
    } else {
      form.value = {
        nombre: '',
        descripcion: null,
        caracteristicas: null,
        esta_activo: true,
        cultivo_id: 0,
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const validar = () => {
  errors.value = {}

  if (!form.value.nombre) {
    errors.value.nombre = 'El nombre es requerido'
  }

  if (form.value.nombre && form.value.nombre.length > 150) {
    errors.value.nombre = 'El nombre no puede exceder 150 caracteres'
  }

  if (!form.value.cultivo_id) {
    errors.value.cultivo_id = 'Debe seleccionar un cultivo'
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
      id: isEditing.value ? props.variedad!.id : undefined,
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
          {{ isEditing ? '✏️ Editar Variedad' : '➕ Nueva Variedad' }}
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
        <!-- Cultivo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cultivo *
          </label>
          <select
            v-model.number="form.cultivo_id"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Seleccionar cultivo...</option>
            <option v-for="cultivo in cultivosStore.cultivos" :key="cultivo.id" :value="cultivo.id">
              {{ cultivo.nombre }}
            </option>
          </select>
          <p v-if="errors.cultivo_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.cultivo_id }}
          </p>
        </div>

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Variedad *
          </label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej: Don Mario 40R21, NK Vanguard"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p v-if="errors.nombre" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.nombre }}
          </p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            v-model="form.descripcion"
            placeholder="Descripción de la variedad..."
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Características -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Características
            </label>
            <input
              v-model="form.caracteristicas"
              type="text"
              placeholder="Ej: Resistente a sequía"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.esta_activo"
                  type="radio"
                  :value="true"
                  class="w-4 h-4"
                />
                <span class="text-gray-700 dark:text-gray-300">Activa</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.esta_activo"
                  type="radio"
                  :value="false"
                  class="w-4 h-4"
                />
                <span class="text-gray-700 dark:text-gray-300">Inactiva</span>
              </label>
            </div>
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

