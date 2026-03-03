<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { onMounted } from 'vue'


const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()

onMounted(() => {
  useTheme().initializeTheme()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <slot />
  </div>
</template>

