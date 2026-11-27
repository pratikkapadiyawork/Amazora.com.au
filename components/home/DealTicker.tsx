import Link from 'next/link'

export interface TickerItem { slug: string; name: string; price: number; comparePrice: number | null }

export function DealTicker({ items }: { items: TickerItem[] }) {
  if (!items.length) return null
  const row = [...items, ...items]
  return (
    <div className="relative bg-[#E11D2E] text-white overflow-hidden border-y border-black/30" aria-label="Black Friday deals">
      <div className="flex w-max bf-marquee py-3.5">
        {row.map((it, i) => (
          <Link key={i} href={`/shop/${it.slug}`} className="flex items-center gap-3 px-7 whitespace-nowrap text-[13px] hover:text-[#FBE7A1] transition-colors">
            <span className="text-[#FBE7A1]">✦</span>
            <span className="font-semibold">{it.name}</span>
            <span className="font-bold tabular-nums">A${it.price.toFixed(2)}</span>
            {it.comparePrice && it.comparePrice > it.price && (
              <span className="line-through opacity-60 tabular-nums">A${it.comparePrice.toFixed(2)}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
