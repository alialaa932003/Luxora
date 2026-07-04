import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'
import type { Address } from '@/types/auth.types'

export const paymentService = {
  createStripeCheckoutSession: (payload: { cartId: string }) =>
    http.post<ApiResponse<{ id: string; url: string }>>('/payments/stripe/create-session', payload),
}
