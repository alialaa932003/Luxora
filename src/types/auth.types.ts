export interface User {
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

export interface Address {
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'customer' | 'seller' | 'admin'
  avatar?: string
  isEmailVerified: boolean
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  acceptTerms: boolean
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: AuthUser
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
