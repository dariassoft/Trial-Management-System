<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
// Redirect a /cosecha manteniendo los parámetros de búsqueda
router.push({
  path: '/cosecha',
  query: route.query
})
</script>
<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-gray-600 dark:text-gray-400">Redirigiendo a Cosecha...</p>
    </div>
  </div>
</template>
