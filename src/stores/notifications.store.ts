import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notificationsService } from '@/services/api/users.service'
import type { Notification } from '@/types/user.types'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)

  async function fetchAll(params?: { page?: number; limit?: number; unreadOnly?: boolean }) {
    loading.value = true
    try {
      const res = await notificationsService.getAll(params)
      notifications.value = res.data.data.notifications
      unreadCount.value = res.data.data.unreadCount
    } finally {
      loading.value = false
    }
  }

  async function markRead(id: string) {
    await notificationsService.markRead(id)
    const notif = notifications.value.find((n) => n.id === id)
    if (notif && !notif.isRead) {
      notif.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  async function markAllRead() {
    await notificationsService.markAllRead()
    notifications.value.forEach((n) => (n.isRead = true))
    unreadCount.value = 0
  }

  return { notifications, unreadCount, loading, fetchAll, markRead, markAllRead }
})
