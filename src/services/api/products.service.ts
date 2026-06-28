import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Product, ProductListParams, Category } from '@/types/product.types'

export const productsService = {
  getAll: (params?: ProductListParams) =>
    http.get<PaginatedResponse<{ products: Product[] }>>('/products', { params }),

  getBySlug: (slug: string) =>
    http.get<ApiResponse<{ product: Product }>>(`/products/${slug}`),

  getFeatured: () =>
    http.get<ApiResponse<{ products: Product[] }>>('/products/featured'),

  getReviews: (productId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    http.get(`/products/${productId}/reviews`, { params }),

  submitReview: (productId: string, formData: FormData) =>
    http.post(`/products/${productId}/reviews`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const categoriesService = {
  getAll: (params?: { featured?: boolean; parentId?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<{ categories: Category[] }>>('/categories', { params }),

  getBySlug: (slug: string) =>
    http.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`),
}
