<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      @click.self="cerrar"
    >
      <!-- Modal Container -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📱 Escanear QR de Parcela
          </h3>
          <button
            type="button"
            @click.prevent.stop="cerrar"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Instrucciones -->
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
            Escanea el código QR de una parcela para ir directamente a registrar sus mediciones
          </p>

          <!-- Scanner -->
          <div class="relative">
            <MediaQRScanner
              ref="scannerRef"
              @scanned="handleScanned"
              @error="handleError"
              @cancel="handleCancel"
            />
          </div>

          <!-- Formato esperado -->
          <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p class="text-xs text-gray-500 dark:text-gray-400">
              <strong>Formatos aceptados:</strong>
            </p>
            <ul class="text-xs text-gray-500 dark:text-gray-400 mt-1 list-disc list-inside">
              <li>Código de parcela (ej: 58-ENTD-43523-A-2.3)</li>
              <li>JSON con ensayoId y parcelaId</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click.prevent.stop="cerrar"
            class="w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                   rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const emit = defineEmits<{
  (e: 'scanned', data: any): void
  (e: 'close'): void
  (e: 'error', message: string): void
}>()

const scannerRef = ref<any>(null)
const isClosed = ref(false)

// Abrir el escáner automáticamente al montar el modal
onMounted(async () => {
  isClosed.value = false
  await nextTick()
  // Pequeño delay para asegurar que el componente esté montado
  setTimeout(() => {
    if (scannerRef.value?.open && !isClosed.value) {
      scannerRef.value.open()
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (scannerRef.value?.close) {
    scannerRef.value.close()
  }
})

function handleScanned(data: any) {
  emit('scanned', data)
  cerrar()
}

function handleError(message: string) {
  emit('error', message)
}

function handleCancel() {
  // El scanner interno se cerró, cerramos el modal también
  cerrar()
}

function cerrar() {
  if (isClosed.value) return // Evitar llamadas múltiples
  isClosed.value = true

  if (scannerRef.value?.close) {
    try {
      scannerRef.value.close()
    } catch (e) {
      // Ignorar errores al cerrar
    }
  }
  emit('close')
}
</script>
