import { http } from '../http'
import type { 
  DashboardStats, 
  RevenueChartPoint, 
  RecentOrder, 
  TopProduct, 
  RecentUser,
  AdminVendor,
  AdminUser,
  AdminProduct,
  AdminOrder,
  AdminPaginatedResult,
  ChartDataPoint
} from '@/types/admin.types'

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await http.get('/admin/stats')
    return res.data.data.stats
  },
  getRevenueChart: async (): Promise<RevenueChartPoint[]> => {
    const res = await http.get('/admin/revenue-chart')
    return res.data.data.revenueChart
  },
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const res = await http.get('/admin/recent-orders')
    return res.data.data.recentOrders
  },
  getTopProducts: async (): Promise<TopProduct[]> => {
    const res = await http.get('/admin/top-products')
    return res.data.data.topProducts
  },
  getRecentUsers: async (): Promise<RecentUser[]> => {
    const res = await http.get('/admin/recent-users')
    return res.data.data.recentUsers
  },
  getVendors: async (params: any): Promise<AdminPaginatedResult<AdminVendor>> => {
    const res = await http.get('/admin/vendors', { params })
    return {
      data: res.data.data.vendors,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: Math.ceil(res.data.meta.total / res.data.meta.limit)
    }
  },
  updateVendorStatus: async (vendorId: string, status: string): Promise<any> => {
    const res = await http.patch(`/admin/vendors/${vendorId}/moderate`, { status })
    return res.data
  },
  getUsers: async (params: any): Promise<AdminPaginatedResult<AdminUser>> => {
    const res = await http.get('/admin/users', { params })
    return {
      data: res.data.data.users,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: Math.ceil(res.data.meta.total / res.data.meta.limit)
    }
  },
  updateUserRole: async (userId: string, role: string): Promise<any> => {
    const res = await http.patch(`/admin/users/${userId}/role`, { role })
    return res.data
  },
  deleteUser: async (userId: string): Promise<any> => {
    const res = await http.delete(`/admin/users/${userId}`)
    return res.data
  },
  getProducts: async (params: any): Promise<AdminPaginatedResult<AdminProduct>> => {
    const res = await http.get('/admin/products', { params })
    return {
      data: res.data.data.products,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: Math.ceil(res.data.meta.total / res.data.meta.limit)
    }
  },
  toggleProductFeatured: async (productId: string): Promise<any> => {
    const res = await http.patch(`/admin/products/${productId}/featured`)
    return res.data
  },
  deleteProduct: async (productId: string): Promise<any> => {
    const res = await http.delete(`/admin/products/${productId}`)
    return res.data
  },
  getOrders: async (params: any): Promise<AdminPaginatedResult<AdminOrder>> => {
    const res = await http.get('/admin/orders', { params })
    return {
      data: res.data.data.orders,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: Math.ceil(res.data.meta.total / res.data.meta.limit)
    }
  },
  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    const res = await http.patch(`/admin/orders/${orderId}/status`, { status })
    return res.data
  },
  getCategoryChart: async (): Promise<ChartDataPoint[]> => {
    const res = await http.get('/admin/category-chart')
    return res.data.data.categoryChart
  },
  getOrderStatusChart: async (): Promise<ChartDataPoint[]> => {
    const res = await http.get('/admin/order-status-chart')
    return res.data.data.orderStatusChart
  }
}

// ── Seller / Vendor dashboard service ──────────────────────────────────────
// vendorId is accepted for call-site compatibility but the backend resolves
// the vendor from the authenticated user's JWT — no need to send it.

export const sellerService = {
  getStats: async (_vendorId: string): Promise<{ totalRevenue: number; totalSold: number; totalProducts: number; rating: number }> => {
    const res = await http.get('/vendors/dashboard/stats')
    return res.data.data.stats
  },

  getRevenueChart: async (_vendorId: string): Promise<RevenueChartPoint[]> => {
    const res = await http.get('/vendors/dashboard/revenue-chart')
    return res.data.data.revenueChart
  },

  getProducts: async (_vendorId: string, params?: { limit?: number; page?: number }): Promise<AdminPaginatedResult<AdminProduct>> => {
    const res = await http.get('/vendors/dashboard/products', { params })
    return {
      data: res.data.data.products,
      total: res.data.meta?.total ?? res.data.data.products.length,
      page: res.data.meta?.page ?? 1,
      limit: res.data.meta?.limit ?? 20,
      totalPages: Math.ceil((res.data.meta?.total ?? res.data.data.products.length) / (res.data.meta?.limit ?? 20))
    }
  },

  getOrders: async (_vendorId: string, params?: { limit?: number; page?: number; status?: string }): Promise<AdminPaginatedResult<AdminOrder>> => {
    const res = await http.get('/vendors/dashboard/orders', { params })
    return {
      data: res.data.data.orders,
      total: res.data.meta?.total ?? res.data.data.orders.length,
      page: res.data.meta?.page ?? 1,
      limit: res.data.meta?.limit ?? 20,
      totalPages: Math.ceil((res.data.meta?.total ?? res.data.data.orders.length) / (res.data.meta?.limit ?? 20))
    }
  },

  addProduct: async (_vendorId: string, payload: {
    name: string
    price: number
    stock: number
    categoryName: string
    thumbnail?: string
    description?: string
  }): Promise<AdminProduct> => {
    const res = await http.post('/vendors/dashboard/products', payload)
    return res.data.data.product
  },

  updateProduct: async (_vendorId: string, productId: string, payload: {
    name?: string
    price?: number
    stock?: number
    categoryName?: string
    thumbnail?: string
  }): Promise<AdminProduct> => {
    const res = await http.patch(`/vendors/dashboard/products/${productId}`, payload)
    return res.data.data.product
  },

  deleteProduct: async (_vendorId: string, productId: string): Promise<void> => {
    await http.delete(`/vendors/dashboard/products/${productId}`)
  },
}
