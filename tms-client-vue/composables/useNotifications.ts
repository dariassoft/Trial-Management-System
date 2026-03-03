// composables/useNotifications.ts
import { ref } from 'vue'

const notification = ref({
  message: '',
  type: '' as 'success' | 'error' | '',
  show: false,
})

export function useNotifications() {
  const showNotification = (message: string, type: 'success' | 'error', duration: number = 3000) => {
    notification.value = { message, type, show: true }
    setTimeout(() => {
      notification.value.show = false
    }, duration)
  }

  return {
    notification,
    showNotification,
  }
}
