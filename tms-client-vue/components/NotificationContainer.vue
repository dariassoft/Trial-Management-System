<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="getNotificationClass(notification.type)"
        class="p-4 rounded-lg shadow-lg flex items-start gap-3 backdrop-blur-sm"
      >
        <div class="flex-shrink-0">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else-if="notification.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="flex-1 text-sm">{{ notification.message }}</div>
        <button
          @click="removeNotification(notification.id)"
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const getNotificationClass = (type: string) => {
  const baseClasses = 'border-l-4'

  switch (type) {
    case 'success':
      return `${baseClasses} bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200`
    case 'error':
      return `${baseClasses} bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200`
    case 'warning':
      return `${baseClasses} bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-200`
    case 'info':
    default:
      return `${baseClasses} bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200`
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

