<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ tipoEnsayo?.id ? 'Editar' : 'Nuevo' }} Tipo de Ensayo
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
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre *
          </label>
          <input
            v-model="form.nombre"
            type="text"
            required
            placeholder="Ej: Fungicida"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            v-model="form.descripcion"
            placeholder="Descripción del tipo de ensayo..."
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>

        <!-- Activo -->
        <div class="flex items-center gap-2">
          <input
            v-model="form.activo"
            type="checkbox"
            id="activo"
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <label for="activo" class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Activo
          </label>
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
            :disabled="!form.nombre.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Props {
  tipoEnsayo?: { id: number; nombre: string; descripcion?: string | null; activo?: boolean } | null
}

interface Emits {
  (e: 'save', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  nombre: '',
  descripcion: null as string | null,
  activo: true,
})

watch(
  () => props.tipoEnsayo,
  (newVal) => {
    if (newVal) {
      form.nombre = newVal.nombre
      form.descripcion = newVal.descripcion ?? null
      form.activo = newVal.activo !== false
    } else {
      form.nombre = ''
      form.descripcion = null
      form.activo = true
    }
  },
  { immediate: true },
)

function enviar() {
  emit('save', {
    nombre: form.nombre.trim(),
    descripcion: form.descripcion || null,
    activo: form.activo,
  })
}
</script>

