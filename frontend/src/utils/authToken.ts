import { useAuthStore } from '@/stores/authStore'

function requestPath(url?: string): string {
  if (!url) return ''
  if (url.startsWith('http')) {
    try {
      return new URL(url).pathname
    } catch {
      return url
    }
  }
  return url
}

function isAdminApiPath(path: string): boolean {
  return /\/admin(\/|$)/.test(path)
}

function isCustomerApiPath(path: string): boolean {
  return /\/customer(\/|$)/.test(path)
}

/** Pilih token sesuai prefix API — admin & customer independen */
export function getTokenForRequest(url?: string): string | null {
  const path = requestPath(url)

  // Admin dicek dulu — /admin/customers mengandung substring "/customer"
  if (isAdminApiPath(path)) {
    return localStorage.getItem('admin_token')
  }
  if (isCustomerApiPath(path)) {
    return localStorage.getItem('customer_token')
  }
  return null
}

export function clearAuthForRequest(url?: string): void {
  const path = requestPath(url)

  if (isAdminApiPath(path)) {
    useAuthStore.getState().logoutAdmin()
    return
  }
  if (isCustomerApiPath(path)) {
    useAuthStore.getState().logoutCustomer()
  }
}

export function hasCustomerSession(): boolean {
  return !!localStorage.getItem('customer_token')
}

export function hasAdminSession(): boolean {
  return !!localStorage.getItem('admin_token')
}

/** Bersihkan state yang sudah tidak punya token di localStorage */
export function syncAuthSessions(): void {
  const adminToken = localStorage.getItem('admin_token')
  const customerToken = localStorage.getItem('customer_token')
  const state = useAuthStore.getState()
  const patch: Partial<typeof state> = {}

  if (!adminToken && (state.adminToken || state.admin)) {
    patch.admin = null
    patch.adminToken = null
  }
  if (!customerToken && (state.customerToken || state.customer)) {
    patch.customer = null
    patch.customerToken = null
  }

  if (Object.keys(patch).length > 0) {
    useAuthStore.setState(patch)
  }
}

export function initAuthSessionSync(): () => void {
  const runSync = () => syncAuthSessions()

  runSync()

  if (useAuthStore.persist.hasHydrated()) {
    runSync()
  } else {
    useAuthStore.persist.onFinishHydration(runSync)
  }

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === 'admin_token' ||
      event.key === 'customer_token' ||
      event.key === 'auth-storage'
    ) {
      runSync()
    }
  }

  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}
