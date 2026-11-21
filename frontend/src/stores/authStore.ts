import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer, User } from '@/types'

interface AuthState {
  admin: User | null
  customer: Customer | null
  adminToken: string | null
  customerToken: string | null
  setAdmin: (user: User, token: string) => void
  setCustomer: (customer: Customer, token: string) => void
  logoutAdmin: () => void
  logoutCustomer: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      customer: null,
      adminToken: null,
      customerToken: null,
      setAdmin: (admin, token) => {
        localStorage.setItem('admin_token', token)
        set({ admin, adminToken: token })
      },
      setCustomer: (customer, token) => {
        localStorage.setItem('customer_token', token)
        set({ customer, customerToken: token })
      },
      logoutAdmin: () => {
        localStorage.removeItem('admin_token')
        set({ admin: null, adminToken: null })
      },
      logoutCustomer: () => {
        localStorage.removeItem('customer_token')
        set({ customer: null, customerToken: null })
      },
    }),
    { name: 'auth-storage' },
  ),
)
