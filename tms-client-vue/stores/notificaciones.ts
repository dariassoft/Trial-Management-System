import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { extractArrayFromResponse, extractErrorMessage } from '~/utils/apiHelpers';

// Define the structure of a notification
export interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  leido: boolean;
  tipo: string;
  ensayoId: number | null;
  createdAt: string;
  link?: string;
}

export const useNotificacionesStore = defineStore('notificaciones', () => {
  // Get the API client instance from the existing composable
  const api = useApi();

  // State properties
  const notifications = ref<Notificacion[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Action to fetch all notifications
  async function fetchNotifications() {
    loading.value = true;
    error.value = null;
    try {
      // Use the correct API client pattern
      const response = await api.get('/notificaciones');
      const data = extractArrayFromResponse(response);
      notifications.value = data;
      // Recalculate unread count
      unreadCount.value = data.filter((n: Notificacion) => !n.leido).length;
    } catch (err) {
      error.value = extractErrorMessage(err, 'Error al cargar notificaciones');
      console.error('Error fetching notifications:', err);
    } finally {
      loading.value = false;
    }
  }

  // Action to fetch only the unread count (lightweight, for polling)
  async function fetchUnreadCount() {
    try {
      const response = await api.get('/notificaciones/unread-count') as any;
      unreadCount.value = response?.count ?? 0;
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }

  // Action to mark a notification as read
  async function markAsRead(id: number) {
    try {
      // Use the correct API client pattern
      await api.patch(`/notificaciones/${id}`, { leido: true });
      const n = notifications.value.find(n => n.id === id);
      if (n && !n.leido) {
        n.leido = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  // Action to mark a notification as unread
  async function markAsUnread(id: number) {
    try {
      // Use the correct API client pattern
      await api.patch(`/notificaciones/${id}`, { leido: false });
      const n = notifications.value.find(n => n.id === id);
      if (n && n.leido) {
        n.leido = false;
        unreadCount.value++;
      }
    } catch (err) {
      console.error('Error marking notification as unread:', err);
    }
  }

  // Action to mark all notifications as read
  async function markAllAsRead() {
    try {
      // Use the correct API client pattern
      await api.patch('/notificaciones/mark-all-read');
      notifications.value.forEach(n => { n.leido = true; });
      unreadCount.value = 0;
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  }

  // Action to delete a notification
  async function deleteNotification(id: number) {
    try {
      // Use the correct API client pattern
      await api.delete(`/notificaciones/${id}`);
      const idx = notifications.value.findIndex(n => n.id === id);
      if (idx !== -1) {
        if (!notifications.value[idx].leido) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
        notifications.value.splice(idx, 1);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }

  // Action to force manual generation of notifications
  async function forceGenerate() {
    try {
      // Use the correct API client pattern
      await api.post('/notificaciones/generar');
      await fetchNotifications();
    } catch (err) {
      console.error('Error generating notifications:', err);
      throw err;
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    forceGenerate,
  };
});
