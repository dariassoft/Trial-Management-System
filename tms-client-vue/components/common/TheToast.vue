<!-- components/common/TheToast.vue -->
<template>
  <div
    v-if="notification.show"
    :class="{
      'bg-green-500': notification.type === 'success',
      'bg-red-500': notification.type === 'error',
    }"
    class="fixed top-5 right-5 text-white p-4 rounded-lg shadow-lg z-50 transition-transform transform"
    :style="{ transform: notification.show ? 'translateX(0)' : 'translateX(100%)' }"
  >
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const { notification } = useNotifications()
</script>
