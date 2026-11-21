import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'

export function CustomerLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setCustomer = useAuthStore((s) => s.setCustomer)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.customerLogin(email, password)
      setCustomer(res.data.data.customer, res.data.data.token)
      toast.success('Login berhasil')
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(redirectTo, { replace: true })
    } catch {
      toast.error('Email atau password salah')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 md:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl dark:border-amber-500/15 dark:shadow-amber-500/5 md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:flex">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(245,158,11,0.2),transparent)]" />
          <div className="relative flex flex-col gap-3">
            <BrandLogo size="hero" variant="dark" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Portal Customer</p>
          </div>
          <div className="relative">
            <h2 className="text-2xl font-bold leading-tight text-white">
              Selamat datang{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                kembali
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Masuk untuk melihat riwayat sewa, checkout, dan kelola pesanan Anda.
            </p>
          </div>
          <p className="relative text-xs text-slate-600">© PT. Masendo Karya Mandiri</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6 flex flex-col items-center gap-2 md:hidden">
            <BrandLogo size="lg" variant="light" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Portal Customer
            </span>
          </div>
          <h1 className="text-2xl font-bold md:hidden">Masuk</h1>
          <p className="mt-1 text-sm text-muted-foreground md:mt-0">Masuk ke akun customer Anda</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <FormField label="Email" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  className="pl-10"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </FormField>
            <FormField label="Password" required>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  className="pl-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </FormField>
            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-amber-600 hover:underline dark:text-amber-400">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
