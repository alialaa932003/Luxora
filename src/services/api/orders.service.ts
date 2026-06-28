import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Order, PlaceOrderPayload } from '@/types/order.types'

export const ordersService = {
  place: (payload: PlaceOrderPayload) =>
    http.post<ApiResponse<{ order: Order }>>('/orders', payload),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    http.get<PaginatedResponse<{ orders: Order[] }>>('/orders', { params }),

  getById: (orderId: string) =>
    http.get<ApiResponse<{ order: Order }>>(`/orders/${orderId}`),

  cancel: (orderId: string, reason: string) =>
    http.patch<ApiResponse<{ order: Partial<Order> }>>(`/orders/${orderId}/cancel`, { reason }),
}
