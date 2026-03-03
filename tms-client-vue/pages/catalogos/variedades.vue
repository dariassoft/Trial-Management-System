<script setup lang="ts">
import VariedadesList from '~/components/catalogos/variedades/VariedadesList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Variedades - TMS',
})
</script>

<template>
  <div>
    <VariedadesList />
  </div>
</template>

