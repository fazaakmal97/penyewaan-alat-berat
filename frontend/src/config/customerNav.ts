export interface CustomerNavItem {
  to: string
  label: string
  exact?: boolean
  match?: string[]
  auth?: boolean
}

export const customerNavItems: CustomerNavItem[] = [
  { to: '/', label: 'Beranda', exact: true },
  { to: '/katalog', label: 'Katalog', match: ['/katalog', '/alat'] },
  { to: '/cara-sewa', label: 'Cara Sewa' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/faq', label: 'FAQ' },
  { to: '/kontak', label: 'Kontak' },
  { to: '/riwayat', label: 'Riwayat', auth: true },
]

export function isCustomerNavActive(pathname: string, item: CustomerNavItem): boolean {
  if (item.exact) return pathname === item.to
  if (item.match) return item.match.some((p) => pathname === p || pathname.startsWith(p + '/'))
  return pathname === item.to || pathname.startsWith(item.to + '/')
}
