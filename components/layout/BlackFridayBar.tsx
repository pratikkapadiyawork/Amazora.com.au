'use client'

import Link from 'next/link'
import { BLACK_FRIDAY } from '@/lib/constants'
import { useCountdown, pad2 } from '@/hooks/useCountdown'

export function BlackFridayBar() {
  const t = useCountdown(BLACK_FRIDAY.endsAt)
  if (t.done) return null

  return (
    <div className="relative h-9 bg-[#E11D2E] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#8E0F1B_0%,#E11D2E_30%,#E11D2E_70%,#8E0F1B_100%)]" />
      <Link
        href="/shop"
        className="relative h-full max-w-[1280px] mx-auto px-4 flex items-center justify-center gap-2 text-[13px] font-medium"
      >
        <span className="font-display font-semibold tracking-wide">Black Friday:</span>
        <span className="hidden sm:inline">{BLACK_FRIDAY.percent}% off everything, ends in</span>
        <span className="sm:hidden">{BLACK_FRIDAY.percent}% off, ends in</span>
        <span className="tabular-nums font-bold" suppressHydrationWarning>
          {t.ready ? `${t.days}d ${pad2(t.hours)}:${pad2(t.minutes)}:${pad2(t.seconds)}` : 'Cyber Monday'}
        </span>
      </Link>
    </div>
  )
}
