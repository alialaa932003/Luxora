import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'
import type { Cart, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types'

export const cartService = {
  get: () =>
    http.get<ApiResponse<{ cart: Cart }>>('/cart'),

  addItem: (payload: AddToCartPayload) =>
    http.post<ApiResponse<{ cart: Cart }>>('/cart/items', payload),

  updateItem: (itemId: string, payload: UpdateCartItemPayload) =>
    http.patch<ApiResponse<{ cart: Cart }>>(`/cart/items/${itemId}`, payload),

  removeItem: (itemId: string) =>
    http.delete<ApiResponse<{ cart: Cart }>>(`/cart/items/${itemId}`),

  clear: () =>
    http.delete<ApiResponse<null>>('/cart'),

  merge: (guestCartId: string) =>
    http.post<ApiResponse<{ cart: Cart }>>('/cart/merge', { guestCartId }),

  applyCoupon: (code: string) =>
    http.post<ApiResponse<{ cart: Cart }>>('/cart/coupon', { code }),

  removeCoupon: () =>
    http.delete<ApiResponse<{ cart: Cart }>>('/cart/coupon'),
}
