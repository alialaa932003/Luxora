import { http } from '../http'
import type { ApiResponse, PaginatedResponse } from '@/types/api.types'
import type { Vendor } from '@/types/user.types'
import type { Product } from '@/types/product.types'

export const vendorsService = {
  getPublicStore: (storeSlug: string) =>
    http.get<ApiResponse<{ vendor: Vendor }>>(`/vendors/${storeSlug}`),

  getStoreProducts: (storeSlug: string, params?: { page?: number; limit?: number }) =>
    http.get<PaginatedResponse<{ products: Product[] }>>(`/products`, { params: { vendorSlug: storeSlug, ...params } }),

  registerAsVendor: (payload: {
    storeName: string
    storeDescription?: string
    businessEmail?: string
    businessPhone?: string
  }) =>
    http.post<ApiResponse<{ vendor: Vendor }>>('/vendors/register', payload),

  getMyStore: () =>
    http.get<ApiResponse<{ vendor: Vendor }>>('/vendors/dashboard/me'),

  updateMyStore: (formData: FormData) =>
    http.patch<ApiResponse<{ vendor: Vendor }>>('/vendors/profile/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
