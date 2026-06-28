import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ChangePasswordPayload,
} from '@/types/auth.types'

export const authService = {
  login: (payload: LoginPayload) =>
    http.post<ApiResponse<LoginResponse>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    http.post<ApiResponse<{ user: { id: string; email: string } }>>('/auth/register', payload),

  logout: () =>
    http.post<ApiResponse<null>>('/auth/logout'),

  verifyEmail: (token: string) =>
    http.post<ApiResponse<null>>('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    http.post<ApiResponse<null>>('/auth/resend-verification', { email }),

  changePassword: (payload: ChangePasswordPayload) =>
    http.patch<ApiResponse<null>>('/auth/change-password', payload),
}
