export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T = unknown> {
  success: boolean
  message?: string
  data: T
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiError {
  success: false
  message: string
  errors?: FieldError[]
  code?: string
  statusCode: number
}

export interface FieldError {
  field: string
  message: string
}
