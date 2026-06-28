export interface ProductImage {
  url: string
  alt: string
  order?: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
}

export interface ProductVendor {
  id: string
  storeName: string
  rating?: number
}

export interface ProductRating {
  average: number
  count: number
  distribution?: Record<string, number>
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  currency: string
  thumbnail: string
  images: ProductImage[]
  category: ProductCategory
  vendor: ProductVendor
  rating: ProductRating
  stock: number
  isFeatured: boolean
  createdAt: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  parent: string | null
  isFeatured: boolean
  productCount: number
  children?: CategoryChild[]
  createdAt?: string
}

export interface CategoryChild {
  id: string
  name: string
  slug: string
  image: string
  productCount: number
}

export interface ProductListParams {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popularity'
  page?: number
  limit?: number
}

export interface SearchParams {
  q: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'rating'
  page?: number
  limit?: number
}

export interface SearchSuggestion {
  type: 'product' | 'category'
  label: string
  slug: string
}
