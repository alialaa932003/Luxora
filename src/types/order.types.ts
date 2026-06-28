import type { Address } from './auth.types'

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'stripe' | 'paypal' | 'cod'

export interface OrderProduct {
  id: string
  name: string
  thumbnail: string
}

export interface OrderItem {
  product: OrderProduct
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderSummary {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note: string
}

export interface OrderCoupon {
  code: string
  discount: number
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  items?: OrderItem[]
  summary?: OrderSummary
  itemCount?: number
  total: number
  shippingAddress?: Address
  billingAddress?: Address
  statusHistory?: OrderStatusHistory[]
  trackingNumber?: string
  carrier?: string
  coupon?: OrderCoupon
  notes?: string
  createdAt: string
}

export interface PlaceOrderPayload {
  shippingAddress: {
    firstName: string
    lastName: string
    phone: string
    addressLine1: string
    city: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    sameAsShipping: boolean
  }
  paymentMethod: PaymentMethod
  paymentIntentId?: string
  couponCode?: string
  notes?: string
}
