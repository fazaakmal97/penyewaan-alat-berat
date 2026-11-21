import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export const BRAND_LOGO_SRC = '/LOGO MKM_1.png'
export const BRAND_NAME = 'PT. Masendo Karya Mandiri'

export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero'

/** Logo portrait — lebar utama, max-height agar pas di header/sidebar */
const SIZE: Record<BrandLogoSize, { width: string; maxH: string }> = {
  xs: { width: 'w-[72px]', maxH: 'max-h-8' },
  sm: { width: 'w-[100px]', maxH: 'max-h-10' },
  md: { width: 'w-[140px]', maxH: 'max-h-14' },
  lg: { width: 'w-[180px]', maxH: 'max-h-[4.5rem]' },
  xl: { width: 'w-[220px]', maxH: 'max-h-24' },
  '2xl': { width: 'w-[260px]', maxH: 'max-h-28' },
  hero: { width: 'w-[min(100%,320px)]', maxH: '' },
}

type BrandLogoVariant = 'light' | 'dark'

interface BrandLogoProps {
  size?: BrandLogoSize
  variant?: BrandLogoVariant
  className?: string
}

export function BrandLogo({ size = 'md', variant = 'light', className }: BrandLogoProps) {
  const { width, maxH } = SIZE[size]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        width,
        maxH,
        variant === 'light' && 'rounded-xl bg-white px-2 py-1.5 shadow-sm ring-1 ring-black/6',
        variant === 'dark' && 'rounded-lg',
        className,
      )}
    >
      <img
        src={BRAND_LOGO_SRC}
        alt={BRAND_NAME}
        className="h-auto max-h-full w-full object-contain"
        draggable={false}
      />
    </span>
  )
}

interface BrandMarkProps {
  to?: string
  subtitle?: string
  subtitleClassName?: string
  size?: BrandLogoSize
  variant?: BrandLogoVariant
  layout?: 'row' | 'col'
  onClick?: () => void
  className?: string
}

export function BrandMark({
  to = '/',
  subtitle,
  subtitleClassName,
  size = 'sm',
  variant = 'light',
  layout = 'col',
  onClick,
  className,
}: BrandMarkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'group shrink-0 transition-opacity hover:opacity-90',
        layout === 'col' ? 'flex flex-col items-start gap-1' : 'flex items-center gap-2.5',
        className,
      )}
    >
      <BrandLogo size={size} variant={variant} />
      {subtitle && (
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400',
            layout === 'row' && 'hidden sm:inline',
            subtitleClassName,
          )}
        >
          {subtitle}
        </span>
      )}
    </Link>
  )
}
