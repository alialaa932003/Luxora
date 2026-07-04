import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Product, ProductListParams, Category } from '@/types/product.types'

export const productsService = {
  getAll: async (params?: ProductListParams) => {
    const res = await http.get<PaginatedResponse<{ products: Product[] }>>('/products', { params })
    if (res.data?.data?.products) {
      res.data.data.products = res.data.data.products.map(p => ({ ...p, id: (p as any)._id || p.id }))
    }
    return res
  },

  getBySlug: async (slug: string) => {
    const res = await http.get<ApiResponse<{ product: Product }>>(`/products/${slug}`)
    if (res.data?.data?.product) {
      res.data.data.product.id = (res.data.data.product as any)._id || res.data.data.product.id
    }
    return res
  },

  getFeatured: async () => {
    const res = await http.get<ApiResponse<{ products: Product[] }>>('/products', { params: { isFeatured: true } })
    if (res.data?.data?.products) {
      res.data.data.products = res.data.data.products.map(p => ({ ...p, id: (p as any)._id || p.id }))
    }
    return res
  },

  getReviews: (productId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    http.get(`/products/${productId}/reviews`, { params }),

  submitReview: (productId: string, formData: FormData) =>
    http.post(`/products/${productId}/reviews`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const categoriesService = {
  getAll: (params?: { isFeatured?: boolean; parent?: string; page?: number; limit?: number }) =>
    http.get<PaginatedResponse<{ categories: Category[] }>>('/categories', { params }),

  getBySlug: (slug: string) =>
    http.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`),
}
