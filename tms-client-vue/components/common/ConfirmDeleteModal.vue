<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
        <!-- Body -->
        <div class="p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
                <span class="text-xl">⚠️</span>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Confirmar eliminación
              </h3>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                ¿Está seguro de que desea eliminar <strong>{{ nombre }}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex gap-3 justify-end">
          <button
            @click="cancelar"
            class="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg font-medium transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmar"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  nombre: string
}>()

const emit = defineEmits<{
  confirmar: []
  cancelar: []
}>()

function confirmar() {
  emit('confirmar')
}

function cancelar() {
  emit('cancelar')
}
</script>

