<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ bloque?.id ? 'Editar' : 'Crear' }} Bloque
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
        <!-- Nombre del Bloque -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del Bloque *
          </label>
          <input
            v-model="form.nombreBloque"
            type="text"
            required
            placeholder="Ej: A, B, C o 1, 2, 3"
            maxlength="10"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Máximo 10 caracteres
          </p>
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
            :disabled="!form.nombreBloque.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            {{ bloque?.id ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Props {
  bloque?: { id: number; nombreBloque: string } | null
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  nombreBloque: '',
})

watch(
  () => props.bloque,
  (newVal) => {
    if (newVal) {
      form.nombreBloque = newVal.nombreBloque
    } else {
      form.nombreBloque = ''
    }
  },
  { immediate: true },
)

function enviar() {
  emit('save', {
    nombreBloque: form.nombreBloque.trim(),
  })
}
</script>

