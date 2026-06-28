import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'
import type { WishlistItems } from '@/types/cart.types'

export const wishlistService = {
  get: () =>
    http.get<ApiResponse<{ wishlist: { items: WishlistItems; itemCount: number } }>>('/wishlist'),

  addItem: (productId: string) =>
    http.post<ApiResponse<{ itemCount: number }>>('/wishlist/items', { productId }),

  removeItem: (productId: string) =>
    http.delete<ApiResponse<{ itemCount: number }>>(`/wishlist/items/${productId}`),

  moveToCart: (productId: string, quantity = 1) =>
    http.post<ApiResponse<{ cartItemCount: number }>>(`/wishlist/items/${productId}/move-to-cart`, { quantity }),
}
