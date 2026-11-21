import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface FaqItem {
  question: string
  answer: string
}

export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.question}
            className={cn(
              'overflow-hidden rounded-2xl border bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-300',
              isOpen
                ? 'border-amber-500/30 shadow-md shadow-amber-500/5 dark:border-amber-500/25'
                : 'border-border/70 dark:border-amber-500/10',
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-foreground transition hover:bg-muted/30"
            >
              <span className="pr-2">{item.question}</span>
              <span className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                isOpen ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground',
              )}>
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')} />
              </span>
            </button>
            <div
              className={cn(
                'grid transition-all duration-300 ease-in-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-border/60 px-5 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
