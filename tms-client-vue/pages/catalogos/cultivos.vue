<script setup lang="ts">
import CultivosList from '~/components/catalogos/cultivos/CultivosList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Cultivos - TMS',
})
</script>

<template>
  <div>
    <CultivosList />
  </div>
</template>

