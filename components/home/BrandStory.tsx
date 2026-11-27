'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, animate, useReducedMotion } from 'framer-motion'
import { RevealHeading, Reveal } from '@/components/shared/RevealHeading'

function Count({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: [0.19, 1, 0.22, 1], onUpdate: n => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref} className="tabular-nums">{prefix}{v}{suffix}</span>
}

export function BrandStory({ images = [], stats }: { images?: string[]; stats: { pieces: number; marques: number; collections: number } }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80])
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [160, -140])
  const y3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-4, 4])
  const [a, b, c] = images

  return (
    <section ref={ref} className="relative overflow-hidden py-28 px-4 md:px-6 bg-[#0F0D0B] border-y border-[rgba(217,169,63,0.12)]">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.06] text-[#F4ECDC]">
            Built in Australia, finished like heirlooms
          </RevealHeading>
          <Reveal delay={0.15}>
            <p className="mt-6 text-[#C9BEA8] text-lg leading-relaxed max-w-[34rem]">
              Amazora is where Australians find gifts that feel considered: hand-cut marble, cast bronze bushrangers,
              crested tankards for the big birthdays and models worth a place on the shelf. Every piece ships from
              an Australian business that answers its own emails.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { n: stats.pieces, label: 'pieces in the collection' },
              { n: stats.marques, label: 'car marques on keyrings' },
              { n: stats.collections, label: 'collections to explore' },
            ].map(s => (
              <div key={s.label} className="border-t border-[#D9A93F]/30 pt-4">
                <p className="font-display text-4xl text-gold-grad"><Count to={s.n} /></p>
                <p className="text-sm text-[#A99F8C] mt-1 leading-snug">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.35}>
            <Link href="/about" className="mt-10 inline-flex h-12 px-7 items-center rounded-full border border-[#F3D27A]/50 text-[#F3D27A] font-semibold hover:bg-[#F3D27A] hover:text-[#0B0A09] transition-colors">
              Read our story
            </Link>
          </Reveal>
        </div>

        <div className="relative h-[520px] md:h-[600px]">
          {a && (
            <motion.div style={{ y: y1, rotate: rot }} className="absolute left-0 top-10 w-[52%] aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-[#F3D27A]/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)] product-img-container">
              <Image src={a} alt="" fill sizes="320px" className="object-cover" />
            </motion.div>
          )}
          {b && (
            <motion.div style={{ y: y2 }} className="absolute right-0 top-0 w-[46%] aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-[#F3D27A]/30 shadow-[0_40px_80px_rgba(0,0,0,0.6)] product-img-container">
              <Image src={b} alt="" fill sizes="300px" className="object-cover" />
            </motion.div>
          )}
          {c && (
            <motion.div style={{ y: y3 }} className="absolute right-[12%] bottom-0 w-[40%] aspect-square rounded-full overflow-hidden ring-2 ring-[#F3D27A]/60 shadow-[0_40px_80px_rgba(0,0,0,0.6)] product-img-container">
              <Image src={c} alt="" fill sizes="260px" className="object-cover" />
            </motion.div>
          )}
          <div className="absolute left-[8%] bottom-[6%] rounded-2xl bg-black/70 backdrop-blur border border-[#F3D27A]/30 px-5 py-4">
            <p className="text-[#F3D27A] font-display text-lg">Australian owned</p>
            <p className="text-[#A99F8C] text-sm">Free delivery over A$99</p>
          </div>
        </div>
      </div>
    </section>
  )
}
