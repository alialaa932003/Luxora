import { http } from '../http'
import type { Category } from '@/types/product.types'
import type { ApiResponse } from '@/types/api.types'

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await http.get<ApiResponse<{ categories: Category[] }>>('/categories')
      if (response.data?.success && response.data?.data?.categories?.length) {
        return response.data.data.categories
      }
      return []
    } catch {
      return []
    }
  },
  getBySlug: async (slug: string): Promise<Category | undefined> => {
    try {
      const response = await http.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`)
      if (response.data?.success && response.data?.data?.category) {
        return response.data.data.category
      }
      return undefined
    } catch {
      return undefined
    }
  }
}
