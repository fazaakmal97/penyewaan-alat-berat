import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { ArrowRight, Sparkles, UserPlus } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { getApiErrorMessage, getApiFieldErrors } from '@/utils/apiError'

const LABELS: Record<string, string> = {
  nama: 'Nama Lengkap',
  email: 'Email',
  no_hp: 'No. HP',
  alamat: 'Alamat',
}

export function RegisterPage() {
  const navigate = useNavigate()
  const setCustomer = useAuthStore((s) => s.setCustomer)
  const [form, setForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    password: '',
    password_confirmation: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const res = await authService.customerRegister(form)
      setCustomer(res.data.data.customer, res.data.data.token)
      toast.success('Registrasi berhasil')
      navigate('/')
    } catch (err) {
      const fieldErrors = getApiFieldErrors(err)
      setErrors(fieldErrors)
      toast.error(getApiErrorMessage(err, 'Registrasi gagal'))
    } finally {
      setLoading(false)
    }
  }

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 md:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl dark:border-amber-500/15 dark:shadow-amber-500/5 md:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:flex">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(245,158,11,0.2),transparent)]" />
          <div className="relative flex flex-col gap-3">
            <BrandLogo size="hero" variant="dark" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">Gratis & mudah</p>
          </div>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Daftar dalam 2 menit
            </span>
            <h2 className="mt-4 text-2xl font-bold leading-tight text-white">
              Mulai sewa alat berat{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                hari ini
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Buat akun untuk mengakses katalog, keranjang, checkout, dan riwayat penyewaan.
            </p>
          </div>
          <p className="relative text-xs text-slate-600">© PT. Masendo Karya Mandiri</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6 flex flex-col items-center gap-2 md:hidden">
            <BrandLogo size="lg" variant="light" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Daftar Akun
            </span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <UserPlus className="h-5 w-5 text-amber-600" />
            <h1 className="text-2xl font-bold">Daftar Akun</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Lengkapi data untuk membuat akun baru</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            {(['nama', 'email', 'no_hp', 'alamat'] as const).map((field) => (
              <FormField
                key={field}
                label={LABELS[field]}
                required={field !== 'alamat'}
                error={errors[field]}
              >
                <Input
                  placeholder={LABELS[field]}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  invalid={!!errors[field]}
                  onChange={(e) => {
                    clearFieldError(field)
                    setForm({ ...form, [field]: e.target.value })
                  }}
                  required={field !== 'alamat'}
                />
              </FormField>
            ))}
            <FormField label="Password" required error={errors.password} hint="Minimal 8 karakter">
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                invalid={!!errors.password}
                onChange={(e) => {
                  clearFieldError('password')
                  setForm({ ...form, password: e.target.value })
                }}
                required
              />
            </FormField>
            <FormField label="Konfirmasi Password" required error={errors.password_confirmation}>
              <Input
                type="password"
                placeholder="Ulangi password"
                value={form.password_confirmation}
                invalid={!!errors.password_confirmation}
                onChange={(e) => {
                  clearFieldError('password_confirmation')
                  setForm({ ...form, password_confirmation: e.target.value })
                }}
                required
              />
            </FormField>
            <Button
              type="submit"
              className="mt-2 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-amber-600 hover:underline dark:text-amber-400">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
