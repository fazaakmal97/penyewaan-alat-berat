import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, CreditCard, Search, ShieldCheck, Truck } from 'lucide-react'
import { HOW_IT_WORKS } from '@/data/customerContent'
import { Button } from '@/components/ui/button'

const STEP_ICONS = [Search, Calendar, ShieldCheck, CreditCard, Truck]

export function CaraSewaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Cara Sewa</h1>
        <p className="mt-3 text-muted-foreground">
          Sewa alat berat dalam 5 langkah mudah — sepenuhnya online dari browser Anda.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = STEP_ICONS[i] ?? Search
          return (
            <div
              key={step.step}
              className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-sm dark:border-amber-500/10"
            >
              <span className="text-4xl font-black text-amber-500/20">{step.step}</span>
              <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-14 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center dark:bg-amber-500/10">
        <h2 className="text-xl font-bold">Siap mencoba?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Mulai dari katalog dan pilih unit pertama Anda.</p>
        <Link to="/katalog" className="mt-6 inline-block">
          <Button className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 font-semibold text-slate-950">
            Buka Katalog
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
