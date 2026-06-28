import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Product, SearchParams, SearchSuggestion } from '@/types/product.types'

export const searchService = {
  search: (params: SearchParams) =>
    http.get<PaginatedResponse<{ query: string; products: Product[]; filters: unknown }>>('/search', { params }),

  suggestions: (q: string) =>
    http.get<ApiResponse<{ suggestions: SearchSuggestion[] }>>('/search/suggestions', { params: { q } }),
}
