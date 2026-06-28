import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Vendor } from '@/types/user.types'
import type { Product } from '@/types/product.types'

export const vendorsService = {
  getPublicStore: (storeSlug: string) =>
    http.get<ApiResponse<{ vendor: Vendor }>>(`/vendors/${storeSlug}`),

  getStoreProducts: (storeSlug: string, params?: { page?: number; limit?: number }) =>
    http.get<PaginatedResponse<{ products: Product[] }>>(`/vendors/${storeSlug}/products`, { params }),

  registerAsVendor: (formData: FormData) =>
    http.post<ApiResponse<{ vendor: Vendor }>>('/vendors/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getMyStore: () =>
    http.get<ApiResponse<{ vendor: Vendor }>>('/vendors/me'),

  updateMyStore: (formData: FormData) =>
    http.patch<ApiResponse<{ vendor: Vendor }>>('/vendors/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
