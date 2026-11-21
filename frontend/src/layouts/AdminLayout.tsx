import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Package,
  CreditCard,
  FileBarChart,
  Users,
  Layers,
  Tag,
  Box,
  Wrench,
  Building2,
  UserCog,
  Menu,
  X,
  ChevronRight,
  Home,
} from 'lucide-react'
import { useState } from 'react'
import { BrandMark } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { useAdminSession } from '@/hooks/useAuthSession'
import { authService } from '@/services/authService'
import { cn } from '@/utils/cn'

const mainMenus = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/sewa', label: 'Penyewaan', icon: Package },
  { to: '/admin/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { to: '/admin/laporan', label: 'Laporan', icon: FileBarChart },
]

const masterMenus = [
  { to: '/admin/customers', label: 'Customer', icon: Users },
  { to: '/admin/jenis-alat', label: 'Jenis Alat', icon: Layers },
  { to: '/admin/merek', label: 'Merek', icon: Tag },
  { to: '/admin/model', label: 'Model', icon: Box },
  { to: '/admin/alat-berat', label: 'Alat Berat', icon: Wrench },
  { to: '/admin/bank', label: 'Bank', icon: Building2 },
  { to: '/admin/users', label: 'User Admin', icon: UserCog },
]

function getPageTitle(pathname: string): string {
  if (pathname === '/admin') return 'Dashboard'
  const fromMain = mainMenus.find((m) => ('end' in m && m.end ? pathname === m.to : pathname.startsWith(m.to)))
  if (fromMain) return fromMain.label
  const fromMaster = masterMenus.find((m) => pathname.startsWith(m.to))
  return fromMaster?.label ?? 'Admin'
}

export function AdminLayout() {
  const { admin, logoutAdmin } = useAdminSession()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageTitle = getPageTitle(location.pathname)

  const handleLogout = async () => {
    try {
      await authService.adminLogout()
    } finally {
      logoutAdmin()
      navigate('/admin/login')
    }
  }

  const NavLink = ({
    to,
    label,
    icon: Icon,
    end,
  }: {
    to: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    end?: boolean
  }) => {
    const active = end ? location.pathname === to : location.pathname.startsWith(to)
    return (
      <Link
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 shadow-sm'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            active ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300',
          )}
        />
        {label}
        {active && <ChevronRight className="ml-auto h-4 w-4 text-amber-400/70" />}
      </Link>
    )
  }

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center justify-between">
        <BrandMark
          to="/admin"
          subtitle="Admin Portal"
          subtitleClassName="text-amber-400/90"
          size="md"
          variant="dark"
          layout="col"
          onClick={() => setSidebarOpen(false)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Menu</p>
        {mainMenus.map((m) => (
          <NavLink key={m.to} {...m} />
        ))}
        <p className="mb-2 mt-6 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Master Data
        </p>
        {masterMenus.map((m) => (
          <NavLink key={m.to} {...m} />
        ))}
      </nav>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-slate-950">
            {admin?.nama?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{admin?.nama}</p>
            <p className="truncate text-xs text-slate-500">@{admin?.username}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full border-white/10 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </Button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 rounded-lg py-2 text-xs text-slate-500 transition hover:text-amber-400"
        >
          <Home className="h-3.5 w-3.5" />
          Portal Customer
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar desktop */}
      <aside className="no-print hidden w-[260px] shrink-0 flex-col border-r border-slate-800/50 bg-slate-950 p-5 md:flex">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="no-print relative flex h-full w-[280px] flex-col bg-slate-950 p-5 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-card/80 px-4 backdrop-blur-md md:h-16 md:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="md:hidden">
              <h1 className="text-base font-semibold tracking-tight">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 sm:inline dark:text-amber-400">
              {admin?.nama}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto max-w-8xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
