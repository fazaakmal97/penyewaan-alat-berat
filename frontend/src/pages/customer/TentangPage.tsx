import { ShieldCheck, Target, Users, Wrench } from 'lucide-react'
import { ElevatedCard } from '@/components/customer/ElevatedCard'
import { COMPANY_PROFILE, WHY_US, STATS } from '@/data/customerContent'

const VALUES = [
  { icon: Target, title: 'Misi', desc: 'Memudahkan akses sewa alat berat berkualitas untuk seluruh pelaku industri di Indonesia.' },
  { icon: ShieldCheck, title: 'Keamanan', desc: 'Unit terawat, proses transaksi terdokumentasi, dan pembayaran terverifikasi.' },
  { icon: Users, title: 'Pelanggan', desc: 'Melayani kontraktor, developer, perusahaan tambang, dan pelaku konstruksi.' },
  { icon: Wrench, title: 'Kualitas', desc: 'Armada rutin diservis agar siap operasi di kondisi lapangan yang menantang.' },
]

export function TentangPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Tentang SewaAlatBerat</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          SewaAlatBerat adalah platform penyewaan alat berat online yang menghubungkan pelanggan
          dengan armada excavator, bulldozer, crane, dan unit pendukung lainnya — dengan proses
          booking, pembayaran, dan pelacakan status yang terintegrasi.
        </p>
      </div>

      <ElevatedCard className="mt-12 overflow-hidden p-0" hover={false}>
        <div className="grid md:grid-cols-5">
          <div className="relative min-h-[220px] md:col-span-2 md:min-h-[300px]">
            <img
              src={COMPANY_PROFILE.image}
              alt={COMPANY_PROFILE.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 md:bg-gradient-to-l md:from-transparent md:to-card/30" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:col-span-3 md:p-8 lg:p-10">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{COMPANY_PROFILE.title}</h2>
            {COMPANY_PROFILE.description.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </ElevatedCard>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border/80 bg-card p-6 text-center shadow-sm dark:border-amber-500/10"
          >
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm dark:border-amber-500/10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10">
              <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="mb-6 text-2xl font-bold">Keunggulan Kami</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/80 bg-muted/30 p-5 dark:border-amber-500/10"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
