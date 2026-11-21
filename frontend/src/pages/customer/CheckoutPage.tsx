import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ChevronRight, MapPin, Phone, User } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { customerService } from '@/services/customerService'
import { formatRupiah } from '@/utils/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { getApiErrorMessage } from '@/utils/apiError'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clear } = useCartStore()
  const customer = useAuthStore((s) => s.customer)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nama_pic: customer?.nama ?? '',
    no_hp_pic: customer?.no_hp ?? '',
    alamat_pengiriman: customer?.alamat ?? '',
    catatan: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerService.checkout({
        ...form,
        items: items.map((i) => ({
          alat_berat_id: i.alat_berat_id,
          tgl_mulai: i.tgl_mulai,
          tgl_selesai: i.tgl_selesai,
        })),
      })
      clear()
      toast.success('Pesanan berhasil dibuat, menunggu verifikasi admin')
      navigate('/riwayat')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Gagal membuat pesanan'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/keranjang" className="transition hover:text-amber-600 dark:hover:text-amber-400">Keranjang</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Checkout</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <form id="checkout-form" onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Data Pengiriman</h2>
          <div className="space-y-4">
            <FormField label="Nama PIC" required>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Nama penanggung jawab"
                  value={form.nama_pic}
                  onChange={(e) => setForm({ ...form, nama_pic: e.target.value })}
                  required
                />
              </div>
            </FormField>
            <FormField label="No. HP" required>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="08xxxxxxxxxx"
                  value={form.no_hp_pic}
                  onChange={(e) => setForm({ ...form, no_hp_pic: e.target.value })}
                  required
                />
              </div>
            </FormField>
            <FormField label="Alamat Pengiriman" required>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20"
                  placeholder="Alamat lengkap lokasi proyek"
                  value={form.alamat_pengiriman}
                  onChange={(e) => setForm({ ...form, alamat_pengiriman: e.target.value })}
                  required
                />
              </div>
            </FormField>
            <FormField label="Catatan (opsional)">
              <Input
                placeholder="Instruksi tambahan untuk pengiriman"
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
              />
            </FormField>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Ringkasan</h2>
            <ul className="mt-4 space-y-3 border-b border-border pb-4">
              {items.map((item) => (
                <li key={item.alat_berat_id} className="flex justify-between gap-2 text-sm">
                  <span className="line-clamp-1 text-muted-foreground">{item.alat.nama}</span>
                  <span className="shrink-0 font-medium">{formatRupiah(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-amber-600 dark:text-amber-400">{formatRupiah(total())}</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-bold text-slate-950 hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Buat Pesanan'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
