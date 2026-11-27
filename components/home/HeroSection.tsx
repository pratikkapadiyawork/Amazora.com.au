'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Truck, ArrowDown } from 'lucide-react'
import { BLACK_FRIDAY } from '@/lib/constants'
import { useCountdown, pad2 } from '@/hooks/useCountdown'
import { Magnetic } from '@/components/motion/Magnetic'

const GoldEmblemScene = dynamic(() => import('@/components/three/GoldEmblemScene'), { ssr: false })

const LINES = ['The gold', 'standard', 'of gifting']

export function HeroSection() {
  const t = useCountdown(BLACK_FRIDAY.endsAt)
  const reduce = useReducedMotion()

  return (
    <section aria-label="Amazora Black Friday" className="relative overflow-hidden bf-noise bg-[rgba(11,10,9,0.4)] min-h-[calc(100svh-108px)] flex items-end lg:items-center">
      {/* light + 3D */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[900px] h-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(226,184,87,0.20),transparent)]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(closest-side,rgba(225,29,46,0.13),transparent)]" />
      </div>
      <GoldEmblemScene className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(11,10,9,0.85)_0%,rgba(11,10,9,0.35)_45%,transparent_70%)] max-lg:bg-[linear-gradient(0deg,rgba(11,10,9,0.95)_35%,transparent_75%)]" />
      <div
        aria-hidden
        className="absolute -bottom-[3vw] left-1/2 -translate-x-1/2 font-display font-bold whitespace-nowrap select-none leading-none text-[19vw] text-transparent pointer-events-none"
        style={{ WebkitTextStroke: '1px rgba(217,169,63,0.09)' }}
      >
        BLACK FRIDAY
      </div>

      <div className="relative w-full max-w-[1280px] mx-auto px-5 md:px-8 pt-[290px] pb-16 lg:py-24">
        <div className="max-w-[620px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#E11D2E] text-white text-sm font-bold px-3 py-1.5 rounded-sm shadow-[0_0_30px_rgba(225,29,46,0.45)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Black Friday −{BLACK_FRIDAY.percent}%
          </motion.p>

          <h1 className="mt-6 font-display font-semibold text-[clamp(2.7rem,6.2vw,5.6rem)] leading-[1.0]" aria-label="The gold standard of gifting">
            {LINES.map((line, i) => (
              <span key={line} aria-hidden className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block gold-sheen-text"
                  initial={reduce ? false : { y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, delay: 0.35 + i * 0.12, ease: [0.19, 1, 0.22, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8 }}
            className="mt-6 max-w-[34rem] text-[#C9BEA8] text-lg leading-relaxed"
          >
            Ned Kelly figurines, marble chess sets, milestone tankards and collector models.
            Everything is <strong className="text-[#F3D27A] font-semibold">{BLACK_FRIDAY.percent}% off</strong> until Cyber Monday.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.95 }}
            className="mt-8 flex items-center gap-2 sm:gap-3"
            aria-label="Time left in the Black Friday sale"
          >
            {([['days', t.days], ['hours', t.hours], ['mins', t.minutes], ['secs', t.seconds]] as const).map(([label, v], i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="relative w-[66px] sm:w-[78px] rounded-xl border border-[#D9A93F]/30 bg-[linear-gradient(180deg,rgba(28,25,22,0.9),rgba(11,10,9,0.9))] backdrop-blur py-3 text-center shadow-[inset_0_1px_0_rgba(243,210,122,0.15),0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden">
                  <AnimatedDigits value={t.ready ? pad2(v) : '--'} />
                  <div className="text-[11px] text-[#A99F8C] mt-1">{label}</div>
                </div>
                {i < 3 && <span className="text-[#D9A93F]/60 font-display text-2xl">:</span>}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.1 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                href="/shop"
                className="relative overflow-hidden inline-flex items-center h-14 px-9 rounded-full bg-[linear-gradient(135deg,#FBE7A1,#E2B857_40%,#B8862B)] text-[#0B0A09] font-bold text-[15px] shadow-[0_10px_40px_rgba(226,184,87,0.4)] hover:shadow-[0_14px_60px_rgba(226,184,87,0.65)] transition-shadow bf-shine"
              >
                Shop the sale
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                href="#showroom"
                className="inline-flex items-center h-14 px-7 rounded-full border border-[#F4ECDC]/25 bg-black/30 backdrop-blur text-[#F4ECDC] font-semibold text-[15px] hover:border-[#F3D27A] hover:text-[#F3D27A] transition-colors"
              >
                Enter the showroom
              </Link>
            </Magnetic>
          </motion.div>

          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-[#A99F8C]">
            <span className="inline-flex items-center gap-2"><Truck size={15} className="text-[#D9A93F]" /> Free AU delivery over A$99</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#D9A93F]" /> Secure Stripe checkout</span>
          </div>
        </div>
      </div>

      <motion.a
        href="#showroom" aria-label="Scroll to the showroom"
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 w-11 h-16 rounded-full border border-[#F3D27A]/40 items-start justify-center pt-2.5 text-[#F3D27A]"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      >
        <motion.span animate={reduce ? undefined : { y: [0, 14, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} />
        </motion.span>
      </motion.a>
    </section>
  )
}

function AnimatedDigits({ value }: { value: string }) {
  return (
    <div className="relative h-9 font-display text-3xl text-[#F4ECDC] tabular-nums leading-9" suppressHydrationWarning>
      <motion.span
        key={value}
        className="absolute inset-0"
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      >
        {value}
      </motion.span>
    </div>
  )
}
