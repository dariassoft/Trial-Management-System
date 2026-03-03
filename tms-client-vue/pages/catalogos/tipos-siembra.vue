<script setup lang="ts">
import TiposSiembraList from '~/components/catalogos/tipos-siembra/TiposSiembraList.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Tipos de Siembra - TMS',
})
</script>

<template>
  <div>
    <TiposSiembraList />
  </div>
</template>

