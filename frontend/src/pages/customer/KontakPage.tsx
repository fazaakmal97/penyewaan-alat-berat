import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'

const CONTACT_INFO = [
  { icon: MapPin, label: 'Alamat', value: 'Jl. Industri Raya No. 88, Jakarta Selatan 12345' },
  { icon: Phone, label: 'Telepon', value: '+62 21 1234 5678' },
  { icon: Mail, label: 'Email', value: 'info@sewaalatberat.com' },
  { icon: Clock, label: 'Jam Operasional', value: 'Senin – Sabtu, 08.00 – 17.00 WIB' },
]

export function KontakPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Hubungi Kami</h1>
        <p className="mt-3 text-muted-foreground">
          Ada pertanyaan seputar sewa alat berat? Tim kami siap membantu Anda.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm dark:border-amber-500/10"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm dark:border-amber-500/10"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="mb-5 text-lg font-semibold">Kirim Pesan</h2>
          <div className="space-y-4">
            <FormField label="Nama" required>
              <Input placeholder="Nama lengkap" required />
            </FormField>
            <FormField label="Email" required>
              <Input type="email" placeholder="email@contoh.com" required />
            </FormField>
            <FormField label="Subjek" required>
              <Input placeholder="Perihal pesan" required />
            </FormField>
            <FormField label="Pesan" required>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20"
                placeholder="Tulis pesan Anda..."
                required
              />
            </FormField>
            <Button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950"
            >
              Kirim Pesan
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Form ini untuk demonstrasi. Untuk respon cepat, hubungi telepon atau email di atas.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
