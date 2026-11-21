import { apiClient, type ApiResponse } from '@/api/client'
import type { Customer, User } from '@/types'

export const authService = {
  adminLogin: (username: string, password: string) =>
    apiClient.post<ApiResponse<{ token: string; user: User }>>('/admin/login', { username, password }),

  customerLogin: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ token: string; customer: Customer }>>('/customer/login', { email, password }),

  customerRegister: (data: Record<string, string>) =>
    apiClient.post<ApiResponse<{ token: string; customer: Customer }>>('/customer/register', data),

  adminLogout: () => apiClient.post('/admin/logout'),
  customerLogout: () => apiClient.post('/customer/logout'),
}
