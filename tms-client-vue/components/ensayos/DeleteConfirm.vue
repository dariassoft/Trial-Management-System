<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div class="mb-4">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <span class="text-2xl">⚠️</span>
          </div>
        </div>

        <h3 class="text-center text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>

        <p class="mt-2 text-center text-sm text-gray-600">
          {{ message }}
        </p>

        <div class="mt-6 flex gap-3">
          <button
            @click="cancel"
            class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="confirm"
            :disabled="isConfirming"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            {{ isConfirming ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface DeleteConfirmProps {
  isOpen: boolean
  title?: string
  message?: string
}

withDefaults(defineProps<DeleteConfirmProps>(), {
  title: '¿Eliminar este elemento?',
  message: 'Esta acción no se puede deshacer. ¿Está seguro?',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const isConfirming = ref(false)

const confirm = async () => {
  isConfirming.value = true
  try {
    emit('confirm')
  } finally {
    isConfirming.value = false
  }
}

const cancel = () => {
  emit('cancel')
}
</script>

