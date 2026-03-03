<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Widget: Ensayos Totales -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Ensayos Totales</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ stats.total }}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🌾</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">Ensayos registrados en el sistema</p>
    </div>

    <!-- Widget: Ensayos Activos -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Ensayos Activos</p>
          <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ stats.activos }}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
          <span class="text-2xl">✅</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">En ejecución actualmente</p>
    </div>

    <!-- Widget: Ensayos Completados -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Completados</p>
          <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{{ stats.completados }}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🎉</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">Finalizados y analizados</p>
    </div>

    <!-- Widget: Pendientes -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-gray-600 dark:text-gray-400 text-sm font-medium">Por Iniciar</p>
          <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{{ stats.pendientes }}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
          <span class="text-2xl">⏳</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">En programación</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stats: {
    total: number
    activos: number
    completados: number
    pendientes: number
  }
}

withDefaults(defineProps<Props>(), {
  stats: () => ({
    total: 0,
    activos: 0,
    completados: 0,
    pendientes: 0,
  }),
})
</script>

