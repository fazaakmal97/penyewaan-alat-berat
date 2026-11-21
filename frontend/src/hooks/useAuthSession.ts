import { useAuthStore } from '@/stores/authStore'
import { hasAdminSession, hasCustomerSession, syncAuthSessions } from '@/utils/authToken'

/** Customer login = ada customer_token di localStorage DAN state store selaras */
export function useCustomerSession() {
  const customer = useAuthStore((s) => s.customer)
  const customerToken = useAuthStore((s) => s.customerToken)
  const logoutCustomer = useAuthStore((s) => s.logoutCustomer)

  const isLoggedIn = hasCustomerSession() && !!customerToken

  return {
    customer: isLoggedIn ? customer : null,
    isLoggedIn,
    logoutCustomer,
  }
}

/** Admin login = ada admin_token di localStorage DAN state store selaras */
export function useAdminSession() {
  const admin = useAuthStore((s) => s.admin)
  const adminToken = useAuthStore((s) => s.adminToken)
  const logoutAdmin = useAuthStore((s) => s.logoutAdmin)

  const isLoggedIn = hasAdminSession() && !!adminToken

  return {
    admin: isLoggedIn ? admin : null,
    isLoggedIn,
    logoutAdmin,
  }
}

export { syncAuthSessions }
