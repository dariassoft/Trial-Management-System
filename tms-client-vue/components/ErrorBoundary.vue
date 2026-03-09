<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-red-600 mb-2">⚠️ Error de Carga</h1>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Hubo un problema al cargar la página. Por favor, intenta nuevamente.
        </p>
        <pre class="bg-gray-100 dark:bg-gray-700 p-3 rounded text-xs text-left overflow-auto mb-4 text-gray-800 dark:text-gray-200">
{{ errorMessage }}
        </pre>
        <div class="flex gap-2">
          <button
            @click="recargar"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            🔄 Reintentar
          </button>
          <button
            @click="volver"
            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  errorMessage?: string
}>()

const router = useRouter()

function recargar() {
  window.location.reload()
}

function volver() {
  router.back()
}
</script>

