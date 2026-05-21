interface PriceDisplayProps {
  price:         number
  comparePrice?: number | null
  size?:         'sm' | 'md' | 'lg' | 'xl'
  className?:    string
}

const SIZE_STYLES = {
  sm: {
    price:   'text-sm font-bold',
    compare: 'text-xs',
    badge:   'text-[9px] px-1.5 py-0.5',
  },
  md: {
    price:   'text-base font-bold',
    compare: 'text-sm',
    badge:   'text-[10px] px-2 py-0.5',
  },
  lg: {
    price:   'text-xl font-bold',
    compare: 'text-sm',
    badge:   'text-xs px-2 py-0.5',
  },
  xl: {
    price:   'text-3xl font-bold',
    compare: 'text-base',
    badge:   'text-xs px-3 py-1',
  },
}

export function PriceDisplay({
  price,
  comparePrice,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  const s       = SIZE_STYLES[size]
  const hasDisc = comparePrice != null && comparePrice > price
  const saving  = hasDisc ? (comparePrice! - price).toFixed(2) : null

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`${s.price} text-brand-navy`}>
        A${price.toFixed(2)}
      </span>
      {hasDisc && (
        <>
          <span className={`${s.compare} text-brand-muted/50 line-through`}>
            A${comparePrice!.toFixed(2)}
          </span>
          <span className={`${s.badge} bg-brand-red text-white font-bold rounded-full uppercase tracking-wide`}>
            Save A${saving}
          </span>
        </>
      )}
    </div>
  )
}
