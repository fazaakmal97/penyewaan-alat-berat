import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { cn } from '@/utils/cn'
import { fieldInvalidClass } from '@/utils/fieldStyles'
import { ArrowRight, HardHat, Lock, Shield, User } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const setAdmin = useAuthStore((s) => s.setAdmin)
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors: { username?: string; password?: string } = {}
    if (!username.trim()) nextErrors.username = 'Username wajib diisi'
    if (!password.trim()) nextErrors.password = 'Password wajib diisi'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      const res = await authService.adminLogin(username, password)
      setAdmin(res.data.data.user, res.data.data.token)
      toast.success('Selamat datang kembali!')
      navigate('/admin')
    } catch {
      toast.error('Username atau password salah')
    } finally {
      setLoading(false)
    }
  }

  const inputWrapperClass = (field: 'username' | 'password', invalid: boolean) =>
    cn(
      'flex items-center gap-2 rounded-lg border bg-background transition-all',
      invalid
        ? fieldInvalidClass
        : focused === field
          ? 'border-amber-500 ring-2 ring-amber-500/20'
          : 'border-border',
    )

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[52%] overflow-hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(245,158,11,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -left-12 bottom-0 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />

        <div className="relative z-10 p-10 xl:p-14">
          <div className="flex flex-col gap-3">
            <BrandLogo size="hero" variant="dark" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
              Admin Portal
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-center px-10 xl:px-14">
          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Kelola penyewaan{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              alat berat
            </span>{' '}
            dengan mudah.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
            Dashboard terpusat untuk master data, transaksi penyewaan, verifikasi pembayaran, dan laporan
            operasional.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Shield, label: 'Aman & Terenkripsi' },
              { icon: HardHat, label: 'Manajemen Alat' },
              { icon: Lock, label: 'Akses Terbatas' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="text-sm font-medium text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 p-10 text-xs text-slate-600 xl:p-14">
          © {new Date().getFullYear()} PT. Masendo Karya Mandiri
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50/30 px-6 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
          <BrandLogo size="xl" variant="light" />
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Admin Portal
          </span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Selamat datang
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Masuk ke Admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Masukkan kredensial administrator untuk melanjutkan.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:shadow-none"
          >
            <FormField label="Username" htmlFor="username" required error={errors.username}>
              <div className={inputWrapperClass('username', !!errors.username)}>
                <User className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  id="username"
                  invalid={!!errors.username}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }))
                  }}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
            </FormField>

            <FormField label="Password" htmlFor="password" required error={errors.password}>
              <div className={inputWrapperClass('password', !!errors.password)}>
                <Lock className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  invalid={!!errors.password}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </FormField>

            <Button
              type="submit"
              className="group mt-2 h-11 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-base font-semibold text-slate-950 shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Masuk Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Bukan admin?{' '}
            <Link to="/" className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400">
              Kembali ke beranda customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
