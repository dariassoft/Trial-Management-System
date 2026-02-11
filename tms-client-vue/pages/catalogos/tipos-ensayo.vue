<script setup lang="ts">
import TiposEnsayoList from '~/components/catalogos/tipos-ensayo/TiposEnsayoList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Tipos de Ensayo - TMS',
})
</script>

<template>
  <div>
    <TiposEnsayoList />
  </div>
</template>

