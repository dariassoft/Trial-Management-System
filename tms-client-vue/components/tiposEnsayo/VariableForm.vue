<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ variable?.id ? 'Editar' : 'Agregar' }} Variable
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="enviar" class="p-4 space-y-4">
        <!-- Nombre de la Variable -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de la Variable *
          </label>
          <input
            v-model="form.nombre_variable"
            type="text"
            required
            placeholder="Ej: PORCENTAJE DE CONTROL GENERAL (BARBECHO)"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Unidad de Medida -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Unidad de Medida (opcional)
          </label>
          <input
            v-model="form.unidad_medida"
            type="text"
            placeholder="Ej: %, ESCALA 1-9, N°"
            maxlength="30"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            v-model="form.descripcion"
            rows="3"
            placeholder="Descripción de la variable..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!form.nombre_variable.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {{ variable?.id ? 'Actualizar' : 'Agregar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Props {
  variable?: { id: number; nombre_variable: string; unidad_medida?: string | null; descripcion?: string | null } | null
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  nombre_variable: '',
  unidad_medida: '',
  descripcion: '',
})

watch(
  () => props.variable,
  (newVal) => {
    if (newVal) {
      form.nombre_variable = newVal.nombre_variable
      form.unidad_medida = newVal.unidad_medida || ''
      form.descripcion = newVal.descripcion || ''
    } else {
      form.nombre_variable = ''
      form.unidad_medida = ''
      form.descripcion = ''
    }
  },
  { immediate: true },
)

function enviar() {
  emit('save', {
    nombre_variable: form.nombre_variable.trim(),
    unidad_medida: form.unidad_medida.trim() || null,
    descripcion: form.descripcion.trim() || null,
  })
}
</script>

