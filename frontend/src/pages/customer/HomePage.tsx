import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  Clock,
  CreditCard,
  Layers,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from 'lucide-react'
import { catalogService } from '@/services/catalogService'
import { AlatCard } from '@/components/AlatCard'
import { FaqAccordion } from '@/components/customer/FaqAccordion'
import { ElevatedCard } from '@/components/customer/ElevatedCard'
import { HeroSlideshow } from '@/components/customer/HeroSlideshow'
import { SectionHeader } from '@/components/customer/SectionHeader'
import {
  FAQ_PREVIEW,
  HOW_IT_WORKS,
  INDUSTRIES,
  STATS,
  TESTIMONIALS,
  WHY_US,
} from '@/data/customerContent'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

const CATEGORY_ICONS = [Truck, Layers, Zap, Sparkles]
const STEP_ICONS = [Search, Calendar, ShieldCheck, CreditCard, Truck]

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Unit Terawat', desc: 'Standar keamanan operasional' },
  { icon: Clock, title: 'Booking Cepat', desc: 'Konfirmasi dalam hitungan jam' },
  { icon: Zap, title: 'Harga Transparan', desc: 'Tarif harian tanpa biaya tersembunyi' },
]

function StatsBand() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(245,158,11,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">Di Angka</span>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Kepercayaan yang Terbukti</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
            Ribuan pelanggan telah mempercayakan operasional proyek mereka kepada kami.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-amber-500/35 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-amber-500/10"
            >
              <p className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-3xl font-bold text-transparent transition-transform duration-300 group-hover:scale-105 md:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const { data: jenis } = useQuery({
    queryKey: ['jenis-alat'],
    queryFn: () => catalogService.jenisAlat().then((r) => r.data.data),
  })

  const { data: terbaru, isLoading: loadingTerbaru } = useQuery({
    queryKey: ['alat-terbaru'],
    queryFn: () => catalogService.terbaru().then((r) => r.data.data),
  })

  const { data: populer, isLoading: loadingPopuler } = useQuery({
    queryKey: ['alat-populer'],
    queryFn: () => catalogService.populer().then((r) => r.data.data),
  })

  return (
    <div>
      <HeroSlideshow />

      {/* Trust strip — ringkas */}
      <section className="relative border-b border-border bg-card/60 dark:border-amber-500/10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center divide-border px-4 py-5 md:flex-nowrap md:divide-x md:px-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 px-4 py-2 md:flex-1 md:justify-center md:px-8">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 ring-1 ring-amber-500/15">
                <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kategori — prioritas utama setelah hero */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          eyebrow="Katalog"
          title="Kategori Alat"
          subtitle="Temukan unit sesuai kebutuhan proyek Anda"
          href="/katalog"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
          {jenis?.map((j, i) => {
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length]
            return (
              <Link
                key={j.id}
                to={`/katalog?jenis_alat_id=${j.id}`}
                className="card-shine group flex flex-col items-center rounded-2xl border border-border/70 bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/35 hover:shadow-lg hover:shadow-amber-500/5 dark:border-amber-500/10 dark:hover:shadow-amber-500/10"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 transition duration-300 group-hover:scale-105 group-hover:from-amber-500/25 group-hover:to-orange-500/15">
                  <Icon className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="font-semibold text-foreground">{j.nama}</p>
                {j.keterangan && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{j.keterangan}</p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Unit terbaru */}
      <section className="bg-muted/40 py-14 dark:bg-muted/20 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Terbaru"
            title="Unit Terbaru"
            subtitle="Penambahan alat berat terbaru di katalog"
            href="/katalog"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loadingTerbaru
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)
              : terbaru?.map((alat) => <AlatCard key={alat.id} alat={alat} />)}
          </div>
        </div>
      </section>

      {/* Populer */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          eyebrow="Favorit"
          title="Paling Populer"
          subtitle="Unit yang paling sering disewa pelanggan"
          href="/katalog"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingPopuler
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)
            : populer?.map((alat) => <AlatCard key={alat.id} alat={alat} />)}
        </div>
      </section>

      {/* Cara sewa */}
      <section className="border-y border-border bg-muted/30 py-14 dark:border-amber-500/10 dark:bg-muted/15 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Proses Mudah"
            title="Cara Sewa"
            subtitle="Lima langkah sederhana untuk menyewa alat berat"
            href="/cara-sewa"
            linkLabel="Pelajari lengkap"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Search
              return (
                <ElevatedCard key={step.step} className="group relative p-5">
                  {i < HOW_IT_WORKS.length - 1 && (
                    <span className="absolute -right-2.5 top-1/2 hidden h-0.5 w-5 bg-amber-500/20 lg:block" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-500/20">{step.step}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 transition group-hover:bg-amber-500/20">
                      <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </ElevatedCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          eyebrow="Keunggulan"
          title="Mengapa SewaAlatBerat?"
          subtitle="Solusi penyewaan alat berat yang terpercaya"
          href="/tentang"
          linkLabel="Tentang kami"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY_US.map((item) => (
            <ElevatedCard key={item.title} className="p-6">
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </ElevatedCard>
          ))}
        </div>
      </section>

      {/* Industri */}
      <section className="border-y border-border bg-card py-12 dark:border-amber-500/10">
        <div className="mx-auto max-w-7xl px-4 text-center md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Industri Terlayani
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {INDUSTRIES.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:border-amber-500/30 hover:shadow-md dark:border-amber-500/15 dark:bg-amber-500/5"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="bg-muted/40 py-14 dark:bg-muted/20 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionHeader
            eyebrow="Testimoni"
            title="Apa Kata Pelanggan"
            subtitle="Pengalaman mereka menggunakan layanan kami"
            centered
          />
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <ElevatedCard key={t.name} className="relative p-6">
                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <Quote className="h-5 w-5 text-amber-600/60 dark:text-amber-400/60" />
                </div>
                <p className="pr-8 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-xs font-bold text-slate-950">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </ElevatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats — posisi ke-3 dari bawah */}
      <StatsBand />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-16">
        <SectionHeader
          eyebrow="Bantuan"
          title="Pertanyaan Umum"
          subtitle="Jawaban singkat seputar layanan sewa kami"
          href="/faq"
          linkLabel="Lihat semua FAQ"
          centered
        />
        <FaqAccordion items={FAQ_PREVIEW} defaultOpen={0} />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-12 text-center shadow-xl shadow-amber-500/15 md:px-12 md:py-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M20 20h20v20H20zM0 0h20v20H0z\'/%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">Siap mulai proyek Anda?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-900/80 md:text-base">
              Daftar akun gratis, pilih alat, dan selesaikan pembayaran dalam satu platform.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/katalog">
                <Button size="lg" className="btn-glow rounded-full bg-slate-950 font-semibold text-white hover:bg-slate-800">
                  Lihat Semua Alat
                </Button>
              </Link>
              <Link to="/kontak">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-slate-950/30 bg-white/20 font-semibold text-slate-950 hover:bg-white/30"
                >
                  Hubungi Kami
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
