<script setup lang="ts">
import PermisosList from '~/components/permisos/PermisosList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Permisos - TMS',
})
</script>

<template>
  <div>
    <PermisosList />
  </div>
</template>

