<template>
  <UsuariosList />
</template>

<script setup lang="ts">
import UsuariosList from '~/components/usuarios/UsuariosList.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

