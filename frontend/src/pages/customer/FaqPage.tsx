import { FaqAccordion } from '@/components/customer/FaqAccordion'
import { FAQ_ITEMS } from '@/data/customerContent'

export function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Pertanyaan Umum</h1>
        <p className="mt-3 text-muted-foreground">
          Jawaban untuk pertanyaan yang sering diajukan seputar penyewaan alat berat.
        </p>
      </div>
      <FaqAccordion items={FAQ_ITEMS} defaultOpen={0} />
    </div>
  )
}
