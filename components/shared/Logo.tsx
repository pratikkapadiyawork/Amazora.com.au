import Link from 'next/link'

/**
 * Amazora vector logo (gold octagon "A" emblem + Cinzel wordmark).
 * Source files live in /public/brand — amazora-logo.svg, amazora-logo-compact.svg, amazora-mark.svg.
 */
export function Logo({
  variant = 'compact',
  className = '',
  height = 36,
  priority = false,
}: {
  variant?: 'compact' | 'full' | 'mark' | 'black-friday'
  className?: string
  height?: number
  priority?: boolean
}) {
  const src = {
    compact:        { file: '/brand/amazora-logo-compact.svg', ratio: 340 / 64 },
    full:           { file: '/brand/amazora-logo.svg',         ratio: 531 / 124 },
    mark:           { file: '/brand/amazora-mark.svg',         ratio: 1 },
    'black-friday': { file: '/brand/amazora-black-friday.svg', ratio: 531 / 132 },
  }[variant]

  return (
    <Link href="/" aria-label="Amazora — return to homepage" className={`inline-flex items-center shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src.file}
        alt="Amazora"
        height={height}
        width={Math.round(height * src.ratio)}
        style={{ height, width: 'auto' }}
        fetchPriority={priority ? 'high' : undefined}
        draggable={false}
      />
    </Link>
  )
}
