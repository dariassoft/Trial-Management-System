<template>
  <ProtocoloList />
</template>

<script setup lang="ts">
import ProtocoloList from '~/components/protocolos/ProtocoloList.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

