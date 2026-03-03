<template>
  <TiposEnsayoList />
</template>

<script setup lang="ts">
import TiposEnsayoList from '~/components/tiposEnsayo/TiposEnsayoList.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

