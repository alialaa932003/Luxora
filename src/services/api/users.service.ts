import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { UserProfile, UpdateProfilePayload, Review, Notification } from '@/types/user.types'
import type { Order } from '@/types/order.types'

export const usersService = {
  getMe: () =>
    http.get<ApiResponse<{ user: UserProfile }>>('/users/me'),

  updateMe: (payload: UpdateProfilePayload) =>
    http.patch<ApiResponse<{ user: UserProfile }>>('/users/me', payload),

  uploadAvatar: (formData: FormData) =>
    http.post<ApiResponse<{ avatar: string }>>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteAvatar: () =>
    http.delete<ApiResponse<null>>('/users/me/avatar'),

  getMyOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    http.get<PaginatedResponse<{ orders: Order[] }>>('/users/me/orders', { params }),

  getMyReviews: (params?: { page?: number; limit?: number }) =>
    http.get<PaginatedResponse<{ reviews: Review[] }>>('/users/me/reviews', { params }),
}

export const notificationsService = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    http.get<PaginatedResponse<{ notifications: Notification[]; unreadCount: number }>>('/notifications', { params }),

  markRead: (id: string) =>
    http.patch<ApiResponse<null>>(`/notifications/${id}/read`),

  markAllRead: () =>
    http.patch<ApiResponse<null>>('/notifications/read-all'),
}
