<template>
  <RolesList />
</template>

<script setup lang="ts">
import RolesList from '~/components/roles/RolesList.vue'

definePageMeta({
  middleware: 'auth',
})
</script>

