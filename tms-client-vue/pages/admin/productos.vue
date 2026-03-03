<script setup lang="ts">
import ProductosList from '~/components/productos/ProductosList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Productos - TMS',
})
</script>

<template>
  <div>
    <ProductosList />
  </div>
</template>

