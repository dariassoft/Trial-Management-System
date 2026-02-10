<script setup lang="ts">
import { computed } from 'vue'
import { useVersionCheck } from '~/composables/useVersionCheck'

const { newVersionAvailable, forceReload, cancelAutoReload } = useVersionCheck()

const showNotification = computed(() => newVersionAvailable.value)
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="showNotification"
      class="fixed top-0 left-0 right-0 z-50 bg-blue-50 border-b-2 border-blue-500 p-4 shadow-lg"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div>
            <p class="font-semibold text-blue-900">Nueva versión disponible</p>
            <p class="text-sm text-blue-700">Se recargará en unos segundos...</p>
          </div>
        </div>
        <div class="flex gap-2 shrink-0">
          <button
            @click="cancelAutoReload"
            type="button"
            class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          >
            Ahora no
          </button>
          <button
            @click="forceReload"
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Actualizar ahora
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>

