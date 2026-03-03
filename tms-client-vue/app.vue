<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { onMounted } from 'vue'

// Inicializar autenticación al montar la app
const authStore = useAuthStore()
const { initializeTheme } = useTheme()

onMounted(() => {
  authStore.initializeAuth()
  initializeTheme()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>
</style>

