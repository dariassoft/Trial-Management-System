<template>
  <LaboratoriosList />
</template>

<script setup lang="ts">
import LaboratoriosList from '~/components/laboratorios/LaboratoriosList.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

