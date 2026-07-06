
export interface CartProduct {
  id: string
  name: string
  slug: string
  thumbnail?: {url: string}
  images?: {url: string}[]
}

export interface CartItem {
  id: string
  product: CartProduct
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface CartCoupon {
  code: string
  discount: number
}

export interface CartSummary {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  couponDiscount: number
  pointsDiscount: number
  total: number
  currency: string
  itemCount: number
}

export interface Cart {
  id: string
  items: CartItem[]
  summary: CartSummary
  coupon: CartCoupon | null
  pointsUsed?: number
}

export interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  thumbnail: string
  stock: number
}

export interface WishlistItem {
  id: string
  product: WishlistProduct
  addedAt: string
}

export type WishlistItems = WishlistItem[]

export interface AddToCartPayload {
  productId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}
