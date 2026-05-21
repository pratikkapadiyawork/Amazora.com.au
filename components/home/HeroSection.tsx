'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d1e33 0%, #1d3557 38%, #2d5a8e 70%, #3d7ab0 100%)' }}
      aria-label="Amazora hero">

      {/* Pure CSS ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full"
          style={{ width: '65vw', height: '65vw', top: '-15%', right: '-10%',
            background: 'radial-gradient(circle, rgba(168,218,220,0.12) 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite' }} />
        <div className="absolute rounded-full"
          style={{ width: '45vw', height: '45vw', bottom: '-10%', left: '-8%',
            background: 'radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)',
            animation: 'float 9s ease-in-out infinite reverse' }} />
        <div className="absolute rounded-full"
          style={{ width: '30vw', height: '30vw', top: '40%', left: '30%',
            background: 'radial-gradient(circle, rgba(69,123,157,0.15) 0%, transparent 70%)',
            animation: 'float 7s ease-in-out infinite 2s' }} />
      </div>

      <motion.div style={{ y, opacity }}
        className="relative z-10 text-center px-5 max-w-5xl mx-auto w-full">

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-10 md:w-16" style={{ background: 'rgba(168,218,220,0.4)' }} />
          <span className="font-body text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase"
            style={{ color: '#a8dadc' }}>
            🇦🇺 Premium Australian Marketplace
          </span>
          <div className="h-px w-10 md:w-16" style={{ background: 'rgba(168,218,220,0.4)' }} />
        </motion.div>

        <h1 className="font-display leading-[1.04] mb-7"
          style={{ fontSize: 'clamp(3rem,11vw,7rem)', letterSpacing: '-0.02em' }}>
          {[
            { t: 'Gifts Worth',  r: false },
            { t: 'Giving.',      r: false },
            { t: 'Remembered',   r: true  },
            { t: 'Forever.',     r: false },
          ].map((w, i) => (
            <motion.span key={w.t} className="block"
              style={{ color: w.r ? '#e63946' : '#f1faee', fontStyle: w.r ? 'italic' : 'normal' }}
              initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.14 + i * 0.13, ease: [0.23, 1, 0.32, 1] }}>
              {w.t}
            </motion.span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.72 }}
          className="font-body mb-9 max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem,2.5vw,1.2rem)', color: 'rgba(168,218,220,0.72)' }}>
          Marble chess sets, fine leather, handcrafted humidors and curated gift collections.
          <br className="hidden md:block" />
          Free delivery to your door, anywhere in Australia.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <Link href="/shop" className="w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto h-14 px-12 rounded-2xl font-body font-semibold text-base"
              style={{ background: '#e63946', color: '#f1faee', boxShadow: '0 8px 32px rgba(230,57,70,0.42)' }}>
              Shop Now
            </motion.button>
          </Link>
          <Link href="/category/gifts" className="w-full sm:w-auto">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto h-14 px-10 rounded-2xl font-body font-semibold text-base"
              style={{ background: 'rgba(168,218,220,0.12)', color: '#f1faee',
                border: '1.5px solid rgba(168,218,220,0.28)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              View Gift Sets →
            </motion.button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2">
          {['⭐ 4.9 Stars', '🚚 Free Delivery', '🔒 Secure', '🇦🇺 Australian', '↩ 30-Day Returns'].map(c => (
            <span key={c} className="font-body text-[10px] md:text-[11px] font-medium px-3 py-1.5 rounded-full"
              style={{ color: 'rgba(168,218,220,0.65)', border: '1px solid rgba(168,218,220,0.18)',
                background: 'rgba(29,53,87,0.35)', backdropFilter: 'blur(8px)' }}>
              {c}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="font-body text-[9px] tracking-[0.22em] uppercase"
          style={{ color: 'rgba(168,218,220,0.28)' }}>Scroll</span>
        <div className="w-5 h-8 rounded-full border flex items-start justify-center p-1.5"
          style={{ borderColor: 'rgba(168,218,220,0.18)' }}>
          <motion.div className="w-1 h-1.5 rounded-full" style={{ background: '#e63946' }}
            animate={{ y: [0, 14, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </section>
  )
}
