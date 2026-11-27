'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck } from 'lucide-react'
import { BLACK_FRIDAY } from '@/lib/constants'
import { useCountdown, pad2 } from '@/hooks/useCountdown'

export interface HeroPick {
  slug: string
  name: string
  image: string
  price: number
  comparePrice: number | null
}

export function HeroSection({ picks = [] }: { picks?: HeroPick[] }) {
  const t = useCountdown(BLACK_FRIDAY.endsAt)
  const [main, left, right] = picks

  return (
    <section
      aria-label="Amazora Black Friday"
      className="relative overflow-hidden bf-noise bg-[#0B0A09]"
    >
      {/* Ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(226,184,87,0.22),transparent)]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(225,29,46,0.14),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D9A93F]/40 to-transparent" />
        {/* Giant outline type */}
        <div
          aria-hidden
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-display font-bold whitespace-nowrap select-none leading-none text-[22vw] lg:text-[15vw] text-transparent"
          style={{ WebkitTextStroke: '1px rgba(217,169,63,0.10)' }}
        >
          BLACK FRIDAY
        </div>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-7"
          >
            <span className="bg-[#E11D2E] text-white text-sm font-bold px-3 py-1.5 rounded-sm">Black Friday −{BLACK_FRIDAY.percent}%</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-semibold text-[clamp(2.6rem,5.8vw,5rem)] leading-[1.02] text-gold-grad"
          >
            The gold
            <br />
            standard
            <br />
            of gifting
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-[34rem] text-[#B9AF9B] text-lg leading-relaxed"
          >
            Ned Kelly figurines, marble chess sets, milestone tankards and collector models —
            now <strong className="text-[#F3D27A] font-semibold">{BLACK_FRIDAY.percent}% off</strong> across the whole store, until Cyber Monday.
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex items-center gap-2 sm:gap-3"
            aria-label="Time left in the Black Friday sale"
          >
            {[
              ['Days', t.days], ['Hours', t.hours], ['Mins', t.minutes], ['Secs', t.seconds],
            ].map(([label, v], i) => (
              <div key={label as string} className="flex items-center gap-2 sm:gap-3">
                <div className="w-[68px] sm:w-[78px] rounded-xl border border-[#D9A93F]/25 bg-[linear-gradient(180deg,#1C1916,#0F0D0B)] py-3 text-center shadow-[inset_0_1px_0_rgba(243,210,122,0.12)]">
                  <div className="font-display text-3xl text-[#F4ECDC] tabular-nums leading-none" suppressHydrationWarning>
                    {t.ready ? pad2(v as number) : '--'}
                  </div>
                  <div className="text-[11px] text-[#A99F8C] mt-1.5">{(label as string).toLowerCase()}</div>
                </div>
                {i < 3 && <span className="text-[#D9A93F]/50 font-display text-2xl">:</span>}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 h-14 px-8 rounded-full bg-[linear-gradient(135deg,#FBE7A1,#E2B857_40%,#B8862B)] text-[#0B0A09] font-bold text-[15px] shadow-[0_10px_40px_rgba(226,184,87,0.35)] hover:shadow-[0_14px_50px_rgba(226,184,87,0.55)] transition-shadow"
            >
              Shop the sale
            </Link>
            <Link
              href="#vault"
              className="inline-flex items-center h-14 px-7 rounded-full border border-[#F4ECDC]/20 text-[#F4ECDC] font-semibold text-[15px] hover:border-[#F3D27A] hover:text-[#F3D27A] transition-colors"
            >
              Choose an edition
            </Link>
          </motion.div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-[#A99F8C]">
            <span className="inline-flex items-center gap-2"><Truck size={15} className="text-[#D9A93F]" /> Free AU delivery over A$99</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#D9A93F]" /> Secure Stripe checkout</span>
          </div>
        </div>

        {/* Vitrine */}
        <div className="relative h-[400px] sm:h-[540px] lg:h-[600px]">
          {left && <HeroCard pick={left} className="absolute left-0 top-16 w-[44%] rotate-[-6deg] z-10" delay={0.35} />}
          {right && <HeroCard pick={right} className="absolute right-0 top-24 w-[44%] rotate-[6deg] z-10" delay={0.45} />}
          {main && <HeroCard pick={main} className="absolute left-1/2 -translate-x-1/2 top-0 w-[58%] z-20" delay={0.2} big />}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[80%] h-10 rounded-[100%] bg-black/70 blur-2xl" />
        </div>
      </div>
    </section>
  )
}

function HeroCard({ pick, className = '', delay = 0, big = false }: { pick: HeroPick; className?: string; delay?: number; big?: boolean }) {
  const off = pick.comparePrice && pick.comparePrice > pick.price ? Math.round((1 - pick.price / pick.comparePrice) * 100) : 0
  return (
    <div className={className}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/shop/${pick.slug}`} className="group block">
        <div className="rounded-t-[999px] rounded-b-[22px] p-[1.5px] bg-[linear-gradient(160deg,#FBE7A1,#8A6A1F_45%,#F3D27A)] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="relative rounded-t-[999px] rounded-b-[21px] overflow-hidden aspect-[3/4] product-img-container">
            <Image
              src={pick.image}
              alt={pick.name}
              fill
              priority={big}
              sizes="(max-width: 1024px) 50vw, 340px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {off > 0 && (
              <span className="absolute top-[18%] right-3 bg-[#E11D2E] text-white text-[11px] font-extrabold px-2 py-1 tracking-wider">−{off}%</span>
            )}
          </div>
        </div>
        {big && <div className="mt-4 text-center">
          <p className={`font-display text-[#F4ECDC] leading-tight line-clamp-1 ${big ? 'text-lg' : 'text-sm'}`}>{pick.name}</p>
          <p className="text-[#F3D27A] font-bold text-sm mt-0.5 tabular-nums">
            A${pick.price.toFixed(2)}
            {pick.comparePrice && pick.comparePrice > pick.price && (
              <span className="ml-2 text-[#A99F8C] font-normal line-through text-xs">A${pick.comparePrice.toFixed(2)}</span>
            )}
          </p>
        </div>}
      </Link>
    </motion.div>
    </div>
  )
}
