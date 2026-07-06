import type { OrderStatus, PaymentStatus } from './order.types'

// ─── KPI / Stats ────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number // percentage vs last period
  totalOrders: number
  ordersGrowth: number
  totalUsers: number
  usersGrowth: number
  totalProducts: number
  productsGrowth: number
  pendingVendors: number
  totalVendors: number
}

// ─── Chart Data ──────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string
  value: number
}

export interface RevenueChartPoint {
  month: string
  revenue: number
  orders: number
}

// ─── Admin User ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'seller' | 'admin'
  isEmailVerified: boolean
  isActive: boolean
  totalOrders: number
  totalSpent: number
  createdAt: string
}

// ─── Admin Product ────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string
  name: string
  slug: string
  thumbnail: string
  category: { id: string; name: string }
  vendor: { id: string; storeName: string }
  price: number
  stock: number
  isFeatured: boolean
  isActive: boolean
  totalSold: number
  revenue: number
  rating: number
  createdAt: string
}

// ─── Admin Order ──────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: string
  orderNumber: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
  }
  itemCount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  createdAt: string
}

// ─── Admin Vendor ─────────────────────────────────────────────────────────────

export interface AdminVendor {
  id: string
  storeName: string
  storeSlug: string
  logo?: string
  businessEmail: string
  ownerName: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  productCount: number
  totalSales: number
  totalRevenue: number
  rating: number
  isVerified: boolean
  joinedAt: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface AdminPaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Recent Items (Overview) ─────────────────────────────────────────────────

export interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  customerAvatar?: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
}

export interface TopProduct {
  id: string
  name: string
  thumbnail: string
  category: string
  unitsSold: number
  revenue: number
}

export interface RecentUser {
  id: string
  firstName: string
  lastName: string
  email: string
  avatar?: string
  role: 'customer' | 'seller' | 'admin'
  createdAt: string
}
