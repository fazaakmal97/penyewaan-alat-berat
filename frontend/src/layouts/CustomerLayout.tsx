import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Clock,
  Headphones,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sun,
  User,
  X,
} from 'lucide-react'
import { BrandLogo, BrandMark } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCustomerSession, syncAuthSessions } from '@/hooks/useAuthSession'
import { useCartStore } from '@/stores/cartStore'
import { useThemeStore } from '@/stores/themeStore'
import { customerNavItems, isCustomerNavActive } from '@/config/customerNav'
import { cn } from '@/utils/cn'

export function CustomerLayout() {
  const { customer, isLoggedIn: isCustomerLoggedIn, logoutCustomer } = useCustomerSession()
  const cartCount = useCartStore((s) => s.items.length)
  const { theme, toggle } = useThemeStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    syncAuthSessions()
  }, [location.pathname])

  const visibleNav = customerNavItems.filter((item) => !item.auth || isCustomerLoggedIn)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = search.trim()
    navigate(q ? `/katalog?search=${encodeURIComponent(q)}` : '/katalog')
    setMobileOpen(false)
  }

  return (
    <div className="customer-mesh flex min-h-screen flex-col bg-background text-foreground">
      {/* Announcement bar */}
      <div className="announcement-bar relative px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-slate-950">
        <span className="relative z-10">
          Sewa alat berat profesional — harga transparan, proses cepat, support responsif
        </span>
      </div>

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-[4.5rem] md:gap-6 md:px-6">
          <BrandMark
            to="/"
            subtitle="Sewa Online"
            size="sm"
            variant="light"
            layout="row"
            onClick={() => setMobileOpen(false)}
          />

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:block md:max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari excavator, bulldozer, crane..."
                className="h-10 rounded-full border-border/80 bg-muted/50 pl-10 pr-4 focus-visible:border-amber-500 focus-visible:ring-amber-500/20"
              />
            </div>
          </form>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-0.5 xl:flex">
            {visibleNav.map((item) => {
              const active = isCustomerNavActive(location.pathname, item)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-all 2xl:px-4 2xl:text-sm',
                    active
                      ? 'nav-pill-active bg-gradient-to-r from-amber-500/15 to-orange-500/10 font-semibold text-amber-700 shadow-sm shadow-amber-500/10 dark:text-amber-300'
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <Link to="/keranjang">
              <Button variant="outline" size="icon" className="relative rounded-full">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-slate-950">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isCustomerLoggedIn && customer ? (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 py-1 pl-1 pr-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-xs font-bold text-slate-950">
                    {customer.nama?.charAt(0)?.toUpperCase() ?? 'C'}
                  </span>
                  <span className="max-w-[100px] truncate text-xs font-medium">{customer.nama}</span>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={logoutCustomer} title="Keluar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block">
                <Button className="btn-glow rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950">
                  <User className="h-4 w-4" />
                  Masuk
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full xl:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 flex h-full w-[min(100%,320px)] flex-col bg-card p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-semibold">Menu</p>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari alat..."
                  className="pl-10"
                />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              {visibleNav.map((item) => {
                const active = isCustomerNavActive(location.pathname, item)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium',
                      active ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'hover:bg-muted',
                    )}
                  >
                    {item.label}
                    {active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                )
              })}
              <Link
                to="/keranjang"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                Keranjang {cartCount > 0 && `(${cartCount})`}
              </Link>
            </nav>

            <div className="mt-auto space-y-2 border-t border-border pt-6">
              {isCustomerLoggedIn && customer ? (
                <>
                  <p className="px-4 text-xs text-muted-foreground">Halo, {customer.nama}</p>
                  <Button variant="outline" className="w-full" onClick={() => { logoutCustomer(); setMobileOpen(false) }}>
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Daftar Akun
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-border bg-card dark:border-amber-500/10 dark:bg-card/90">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <BrandLogo size="md" variant="light" />
                <div>
                  <p className="font-bold">PT. Masendo Karya Mandiri</p>
                  <p className="text-sm text-muted-foreground">Platform sewa alat berat terpercaya</p>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Sewa excavator, bulldozer, crane, dan alat berat lainnya dengan proses online yang mudah —
                dari pemilihan unit hingga pembayaran.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { icon: ShieldCheck, label: 'Terpercaya' },
                  { icon: Clock, label: 'Proses Cepat' },
                  { icon: Headphones, label: 'Support 24/7' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Menu</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {customerNavItems.filter((i) => !i.auth || isCustomerLoggedIn).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="transition hover:text-amber-600 dark:hover:text-amber-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li><Link to="/keranjang" className="transition hover:text-amber-600 dark:hover:text-amber-400">Keranjang</Link></li>
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold">Akun & Lainnya</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="transition hover:text-amber-600 dark:hover:text-amber-400">Masuk</Link></li>
                <li><Link to="/register" className="transition hover:text-amber-600 dark:hover:text-amber-400">Daftar</Link></li>
                <li><Link to="/admin/login" className="transition hover:text-amber-600 dark:hover:text-amber-400">Portal Admin</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} PT. Masendo Karya Mandiri. Semua hak dilindungi.</p>
            <p>Dibuat untuk penyewaan alat berat profesional</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
