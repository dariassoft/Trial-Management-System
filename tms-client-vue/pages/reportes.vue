<script setup lang="ts">
import ReportesGenerator from '~/components/reportes/ReportesGenerator.vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Generador de Reportes - TMS',
})
</script>

<template>
  <div>
    <ReportesGenerator />
  </div>
</template>

