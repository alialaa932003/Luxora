import type { Address } from './auth.types'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'seller' | 'admin'
  isEmailVerified: boolean
  address?: Address
  createdAt: string
  updatedAt: string
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  address?: Partial<Address>
}

export interface Review {
  id: string
  product?: {
    id: string
    name: string
    thumbnail: string
  }
  user?: {
    id: string
    firstName: string
    avatar?: string
  }
  rating: number
  title: string
  body: string
  images?: string[]
  verifiedPurchase?: boolean
  createdAt: string
}

export interface ReviewSummary {
  average: number
  count: number
  distribution: Record<string, number>
}

export interface Notification {
  id: string
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
  isRead: boolean
  createdAt: string
}

export interface Vendor {
  id: string
  storeName: string
  storeSlug?: string
  storeDescription?: string
  businessEmail?: string
  logo?: string
  banner?: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rating?: { average: number; count: number }
  productCount?: number
  totalSales?: number
  isVerified?: boolean
  joinedAt?: string
  createdAt?: string
}
