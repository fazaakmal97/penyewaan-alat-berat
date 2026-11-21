import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

interface HeroSlide {
  image: string
  badge: string
  title: string
  highlight: string
  suffix?: string
  description: string
  cta: { label: string; to: string }
  secondary?: { label: string; to: string }
  stat?: { value: string; label: string }
}

const SLIDES: HeroSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1600&q=80',
    badge: 'Platform Sewa Alat Berat #1',
    title: 'Sewa alat berat',
    highlight: 'lebih mudah',
    suffix: '& terpercaya',
    description:
      'Excavator, bulldozer, crane — pilih unit terbaik, pesan online, dan bayar dengan proses yang transparan.',
    cta: { label: 'Jelajahi Katalog', to: '/katalog' },
    secondary: { label: 'Daftar Gratis', to: '/register' },
    stat: { value: '500+', label: 'Unit tersedia' },
  },
  {
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80',
    badge: 'Unit Premium Terawat',
    title: 'Alat berat',
    highlight: 'siap operasi',
    suffix: 'untuk proyek Anda',
    description:
      'Setiap unit melalui pemeriksaan berkala. Sewa dengan tenang untuk konstruksi, pertambangan, dan infrastruktur.',
    cta: { label: 'Lihat Unit Tersedia', to: '/katalog' },
    stat: { value: '24/7', label: 'Support online' },
  },
  {
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80',
    badge: 'Proses Online Cepat',
    title: 'Booking',
    highlight: 'dalam hitungan menit',
    description:
      'Pilih tanggal sewa, checkout, dan upload bukti bayar — semua dari satu platform tanpa ribet.',
    cta: { label: 'Mulai Sewa Sekarang', to: '/katalog' },
    secondary: { label: 'Masuk Akun', to: '/login' },
    stat: { value: '100%', label: 'Harga transparan' },
  },
]

const INTERVAL_MS = 6000

export function HeroSlideshow() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const goTo = useCallback((index: number) => {
    setActive((index + SLIDES.length) % SLIDES.length)
    setProgress(0)
  }, [])

  const next = useCallback(() => goTo(active + 1), [active, goTo])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])

  useEffect(() => {
    if (paused) return
    const tick = 50
    const timer = window.setInterval(() => {
      setProgress((p) => {
        const next = p + (tick / INTERVAL_MS) * 100
        if (next >= 100) {
          setActive((a) => (a + 1) % SLIDES.length)
          return 0
        }
        return next
      })
    }, tick)
    return () => window.clearInterval(timer)
  }, [paused, active])

  const slide = SLIDES[active]

  return (
    <section
      className="relative h-[min(88vh,700px)] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-in-out',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== active}
        >
          <img
            src={s.image}
            alt=""
            className={cn(
              'h-full w-full object-cover',
              i === active && 'hero-ken-burns',
            )}
          />
          {/* Overlay — light: gelap lembut agar tidak silau; dark: navy */}
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/45 to-slate-900/10 dark:from-[#060b14]/95 dark:via-[#060b14]/75 dark:to-[#060b14]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/10 dark:from-[#060b14]/80 dark:to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_75%_45%,rgba(245,158,11,0.14),transparent)] dark:bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(245,158,11,0.12),transparent)]" />
        </div>
      ))}

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl dark:bg-amber-500/20" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl dark:bg-orange-600/15" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 md:px-6">
        <div key={active} className="hero-content-enter max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-amber-200 shadow-lg shadow-black/10 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            {slide.badge}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
            {slide.title}{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
            {slide.suffix && <> {slide.suffix}</>}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            {slide.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={slide.cta.to}>
              <Button
                size="lg"
                className="btn-glow rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-8 font-bold text-slate-950"
              >
                {slide.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {slide.secondary && (
              <Link to={slide.secondary.to}>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  {slide.secondary.label}
                </Button>
              </Link>
            )}
          </div>

          {slide.stat && (
            <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 shadow-sm backdrop-blur-md">
              <p className="text-2xl font-bold text-amber-300">{slide.stat.value}</p>
              <p className="text-sm text-slate-300">{slide.stat.label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Slide counter */}
      <div className="pointer-events-none absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-1 md:flex md:right-8">
        <span className="text-2xl font-bold text-white/90">{String(active + 1).padStart(2, '0')}</span>
        <span className="h-8 w-px bg-white/20" />
        <span className="text-sm text-white/40">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <ChevronDown className="scroll-hint h-6 w-6 text-white/50" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-10 mx-auto max-w-7xl px-4 md:bottom-8 md:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Dots + progress */}
          <div className="flex items-center gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="group relative h-2 overflow-hidden rounded-full transition-all"
                style={{ width: i === active ? 48 : 8 }}
              >
                <span className="absolute inset-0 rounded-full bg-white/25" />
                {i === active && (
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {i === active && progress === 0 && (
                  <span className="absolute inset-0 rounded-full bg-amber-500/60" />
                )}
              </button>
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              onClick={prev}
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              onClick={next}
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
