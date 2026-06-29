import { http } from '../http'
import type { Category } from '@/types/product.types'
import type { ApiResponse } from '@/types/api.types'
import { dummyCategories } from '@/lib/dummyData'

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await http.get<ApiResponse<{ categories: Category[] }>>('/categories')
      if (response.data?.success && response.data?.data?.categories?.length) {
        return response.data.data.categories
      }
      return dummyCategories
    } catch {
      return dummyCategories
    }
  },
  getBySlug: async (slug: string): Promise<Category | undefined> => {
    try {
      const response = await http.get<ApiResponse<{ category: Category }>>(`/categories/${slug}`)
      if (response.data?.success && response.data?.data?.category) {
        return response.data.data.category
      }
      return dummyCategories.find(c => c.slug === slug)
    } catch {
      return dummyCategories.find(c => c.slug === slug)
    }
  }
}
