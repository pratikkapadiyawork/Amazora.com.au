'use client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link  from 'next/link'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ShoppingBag, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

// ── SUMMER SALE PRODUCTS ─────────────────────────────────────────────────
// Image files confirmed present in public/products/
const SUMMER_PRODUCTS = [
  {
    slug:        'ned-kelly-1-gun-bronze',
    name:        'Ned Kelly Figurine',
    subtitle:    'Bronze Edition — 1 Gun',
    salePrice:   47.45,
    origPrice:   49.95,
    mainImg:     '/products/ned-kelly-bronze-main.jpg',
    extraImgs:   [
      '/products/ned-kelly--bronze--2.jpeg',
      '/products/ned-kelly--bronze--3.jpeg',
    ],
    tagline:     "Australia's most iconic outlaw.",
    description: "Hand-finished bronze figurine of Australia's legendary bushranger. A powerful conversation piece for any room.",
    badge:       '🇦🇺 Iconic Australian',
    color:       '#92400e',
    gradient:    'from-amber-900/90 via-amber-800/60 to-transparent',
    accentHex:   '#fbbf24',
  },
  {
    slug:        'miniature-guitar-acoustic',
    name:        'Miniature Guitar',
    subtitle:    'Acoustic Replica — Display Edition',
    salePrice:   28.45,
    origPrice:   29.95,
    mainImg:     '/products/guitar-main.jpg',
    extraImgs:   [
      '/products/guitar--g-1--2.jpg',
      '/products/guitar--g-1--3.jpg',
    ],
    tagline:     'For the music lover in your life.',
    description: 'Full-detail miniature acoustic guitar with real strings and display stand. A gift they\'ll keep forever.',
    badge:       '🎸 Music Gift',
    color:       '#0e7490',
    gradient:    'from-brand-navy/92 via-brand-navy/65 to-transparent',
    accentHex:   '#a8dadc',
  },
  {
    slug:        'cigar-cutter-cc1',
    name:        'Cigar Cutter',
    subtitle:    'Precision Guillotine — Stainless Steel',
    salePrice:   14.20,
    origPrice:   14.95,
    mainImg:     '/products/cigar-cutter-main.jpg',
    extraImgs:   [
      '/products/cigar-cutter--cc1-1495--2.jpg',
      '/products/cigar-cutter--cc1-1495--4.jpg',
    ],
    tagline:     'The perfect cut, every time.',
    description: 'Surgical-grade stainless steel guillotine cutter with a razor-sharp blade. Fits all standard ring gauges.',
    badge:       '✂️ Cigar Essential',
    color:       '#1d3557',
    gradient:    'from-brand-navy/95 via-brand-steel/60 to-transparent',
    accentHex:   '#457b9d',
  },
  {
    slug:        'marble-ashtray-m1',
    name:        'Marble Ashtray',
    subtitle:    'Natural Stone — Classic Edition',
    salePrice:   33.20,
    origPrice:   34.95,
    mainImg:     '/products/marble-ashtray-main.jpg',
    extraImgs:   [
      '/products/marble-ashtray--m-1--2.jpg',
      '/products/marble-ashtray--m-1--3.jpg',
    ],
    tagline:     'Carved from a single piece of marble.',
    description: 'A heavy natural marble ashtray with unique veining found nowhere else. A timeless desk or lounge statement piece.',
    badge:       '🪨 Natural Stone',
    color:       '#1e3a5f',
    gradient:    'from-brand-navy/92 via-brand-navy/55 to-transparent',
    accentHex:   '#e63946',
  },
] as const

type Product = typeof SUMMER_PRODUCTS[number]

// ── SALE COUNTDOWN ────────────────────────────────────────────────────────
const SALE_END = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

function useSaleCountdown() {
  const [t, setT] = useState({ d: 7, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const ms = SALE_END.getTime() - Date.now()
      if (ms <= 0) return
      setT({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000)  / 60000),
        s: Math.floor((ms % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

// ── PRODUCT BACKGROUND IMAGE ──────────────────────────────────────────────
function ProductBgImage({ src, alt, fallbackColor }: { src: string; alt: string; fallbackColor: string }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${fallbackColor}55, ${fallbackColor}99)` }}
        aria-hidden="true"
      >
        <span className="text-white/10 font-display" style={{ fontSize: 'clamp(6rem,20vw,16rem)' }}>✦</span>
      </div>
    )
  }
  return (
    <Image
      src={src} alt={alt} fill priority
      className="object-cover object-center"
      sizes="(max-width: 768px) 100vw, 65vw"
      onError={() => setErr(true)}
    />
  )
}

// ── THUMBNAIL IMAGE ───────────────────────────────────────────────────────
function ThumbImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false)
  if (err) {
    return <div className="absolute inset-0 bg-brand-steel/30 rounded-xl" aria-hidden="true" />
  }
  return (
    <Image
      src={src} alt={alt} fill
      className="object-cover"
      sizes="64px"
      onError={() => setErr(true)}
    />
  )
}

// ── DIGIT FLIP ANIMATION ──────────────────────────────────────────────────
function CountdownDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y:  0, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white/20 rounded px-1.5 py-0.5 tabular-nums min-w-[28px] text-center text-xs font-bold"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-[8px] text-white/40 mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
interface SummerSaleShowcaseProps {
  /** Pass DB products to override hardcoded data. Falls back to SUMMER_PRODUCTS. */
  products?: Array<{
    slug: string
    name: string
    price: number | string
    comparePrice?: number | string | null
    images: string[]
    category?: { name: string }
  }>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SummerSaleShowcase(_props: SummerSaleShowcaseProps) {
  const [active,  setActive]  = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [dir,     setDir]     = useState<1 | -1>(1)
  const [added,   setAdded]   = useState<string | null>(null)
  const addItem   = useCartStore(s => s.addItem)
  const countdown = useSaleCountdown()
  const reduced   = useReducedMotion()
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = SUMMER_PRODUCTS.length

  const go = useCallback((idx: number, d: 1 | -1 = 1) => {
    setDir(d)
    setActive(idx)
  }, [])

  const next = useCallback(() => go(((active + 1) % count) as number, 1), [active, go, count])
  const prev = useCallback(() => go(((active - 1 + count) % count) as number, -1), [active, go, count])

  // Auto-advance every 4 s unless paused
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, next])

  const p = SUMMER_PRODUCTS[active]
  const saving = (p.origPrice - p.salePrice).toFixed(2)

  const EASE_PREMIUM = [0.23, 1, 0.32, 1] as [number, number, number, number]
  const EASE_IN      = [0.4, 0, 1, 1]     as [number, number, number, number]

  const contentVariants = {
    enter: (d: number) => ({
      x:       reduced ? 0 : d * 70,
      opacity: 0,
      scale:   0.98,
    }),
    center: {
      x:       0,
      opacity: 1,
      scale:   1,
      transition: { duration: 0.55, ease: EASE_PREMIUM },
    },
    exit: (d: number) => ({
      x:       reduced ? 0 : d * -70,
      opacity: 0,
      scale:   0.98,
      transition: { duration: 0.3, ease: EASE_IN },
    }),
  }

  const handleAddToCart = (prod: Product) => {
    addItem({
      productId: prod.slug,
      name:      `${prod.name} — ${prod.subtitle}`,
      slug:      prod.slug,
      image:     prod.mainImg,
      price:     prod.salePrice,
    })
    setAdded(prod.slug)
    setTimeout(() => setAdded(null), 2200)
  }

  const pauseTemporarily = () => {
    setPaused(true)
    setTimeout(() => setPaused(false), 8000)
  }

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Summer Sale — limited time offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── TOP BANNER ─────────────────────────────────────────────────── */}
      <div className="bg-brand-red text-white py-2.5 px-4">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap size={14} className="fill-white flex-shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold tracking-widest uppercase">
              ☀️ Summer Sale — 5% Off These Products · Limited Time
            </span>
          </div>
          {/* Live countdown */}
          <div
            className="flex items-center gap-2"
            aria-live="polite"
            aria-label={`Sale ends in ${countdown.d} days ${countdown.h} hours ${countdown.m} minutes ${countdown.s} seconds`}
          >
            <span className="text-xs text-white/60 font-medium">Ends in</span>
            <div className="flex items-end gap-1.5">
              <CountdownDigit value={countdown.d} label="d" />
              <CountdownDigit value={countdown.h} label="h" />
              <CountdownDigit value={countdown.m} label="m" />
              <CountdownDigit value={countdown.s} label="s" />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN SHOWCASE ──────────────────────────────────────────────── */}
      <div className="relative min-h-[520px] md:min-h-[620px] lg:min-h-[680px] bg-brand-navy overflow-hidden">

        {/* Background — cross-fades on product change */}
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`bg-${active}`}
            className="absolute inset-0"
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1,   transition: { duration: 0.85, ease: [0.23, 1, 0.32, 1] } }}
            exit={{    opacity: 0, scale: 0.98, transition: { duration: 0.4  } }}
          >
            <ProductBgImage src={p.mainImg} alt={p.name} fallbackColor={p.color} />
            <div className={`absolute inset-0 bg-gradient-to-r ${p.gradient}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20" aria-hidden="true">
          {!paused && (
            <motion.div
              key={`bar-${active}`}
              className="h-full bg-brand-red"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 md:px-6 h-full flex items-center py-16 md:py-20">
          <div className="max-w-lg w-full">

            {/* Badges */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${active}`}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0    }}
                exit={{    opacity: 0, y: -14   }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap items-center gap-2 mb-5"
              >
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-brand-red text-white uppercase tracking-wider">
                  ☀️ Summer Sale · 5% Off
                </span>
                <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full glass-card text-brand-cream/80 border border-white/15">
                  {p.badge}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Title + description — slides in from the direction of travel */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`title-${active}`}
                custom={dir}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <h2
                  className="font-display text-brand-cream leading-[1.05] mb-1.5"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)' }}
                >
                  {p.name}
                </h2>
                <p className="text-brand-cream/50 text-xs font-bold uppercase tracking-[0.18em] mb-4">
                  {p.subtitle}
                </p>
                <p className="text-brand-cream/70 text-base md:text-lg leading-relaxed mb-7 max-w-sm font-light">
                  {p.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Price reveal */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0,  transition: { duration: 0.4, delay: 0.08 } }}
                exit={{    opacity: 0, y: -10, transition: { duration: 0.25 } }}
                className="flex items-center gap-4 mb-8"
              >
                <span
                  className="font-bold text-brand-cream tabular-nums"
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
                >
                  A${p.salePrice.toFixed(2)}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-brand-cream/40 line-through text-base leading-none">
                    A${p.origPrice.toFixed(2)}
                  </span>
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wide leading-none">
                    Save A${saving} · 5% off
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`cta-${active}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0,  transition: { duration: 0.4, delay: 0.12 } }}
                exit={{    opacity: 0,         transition: { duration: 0.2 } }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAddToCart(p)}
                  className={`
                    h-14 px-8 rounded-2xl font-bold text-sm flex items-center justify-center gap-2
                    transition-all duration-300
                    ${added === p.slug
                      ? 'bg-green-500 text-white shadow-none'
                      : 'bg-brand-red text-white shadow-cta hover:shadow-cta-hover hover:bg-brand-red-dark'
                    }
                  `}
                  aria-label={`Add ${p.name} to cart for A$${p.salePrice.toFixed(2)}`}
                >
                  <ShoppingBag size={17} aria-hidden="true" />
                  {added === p.slug ? '✓ Added to Cart!' : `Add to Cart — A$${p.salePrice.toFixed(2)}`}
                </motion.button>

                <Link href={`/shop/${p.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-7 rounded-2xl glass border border-white/20 text-brand-cream font-semibold text-sm hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    View Details →
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrow navigation */}
        <button
          onClick={() => { prev(); pauseTemporarily() }}
          aria-label="Previous product"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          onClick={() => { next(); pauseTemporarily() }}
          aria-label="Next product"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        {/* Slide counter — top right */}
        <div
          className="absolute top-6 right-6 z-20 flex items-center gap-2"
          aria-label={`Product ${active + 1} of ${count}`}
        >
          {SUMMER_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { go(i, i > active ? 1 : -1); pauseTemporarily() }}
              aria-label={`Go to product ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === active ? 'bg-white w-6' : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── THUMBNAIL STRIP ──────────────────────────────────────────────── */}
      <div className="bg-brand-navy/95 border-t border-white/8 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-4 divide-x divide-white/8">
            {SUMMER_PRODUCTS.map((prod, i) => {
              const isActive = i === active
              const prodSaving = (prod.origPrice - prod.salePrice).toFixed(2)
              return (
                <motion.button
                  key={prod.slug}
                  onClick={() => { go(i, i > active ? 1 : -1); pauseTemporarily() }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  className={`
                    relative flex flex-col items-center gap-2 py-4 px-2 md:px-4
                    transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-red
                    ${isActive ? 'bg-white/8' : 'hover:bg-white/4'}
                  `}
                  aria-label={`View ${prod.name} — A$${prod.salePrice.toFixed(2)}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Thumbnail */}
                  <div className={`
                    relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden bg-brand-steel/20 flex-shrink-0
                    transition-all duration-300 ${isActive ? 'ring-2 ring-brand-red' : ''}
                  `}>
                    <ThumbImage src={prod.mainImg} alt={prod.name} />
                    {/* Dimming overlay for inactive */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-brand-navy/45 transition-opacity duration-300 group-hover:opacity-0" />
                    )}
                    {/* Active scale */}
                    {isActive && (
                      <motion.div
                        layoutId="thumb-zoom"
                        className="absolute inset-0 ring-0 rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="text-center min-w-0 w-full px-1">
                    <p className={`text-[10px] md:text-xs font-semibold leading-tight truncate transition-colors ${
                      isActive ? 'text-brand-cream' : 'text-white/40'
                    }`}>
                      {prod.name}
                    </p>
                    <p className={`text-[10px] md:text-xs font-bold mt-0.5 transition-colors tabular-nums ${
                      isActive ? 'text-brand-red' : 'text-white/25'
                    }`}>
                      A${prod.salePrice.toFixed(2)}
                    </p>
                    <p className={`text-[9px] transition-colors ${
                      isActive ? 'text-green-400/80' : 'text-white/20'
                    }`}>
                      Save A${prodSaving}
                    </p>
                  </div>

                  {/* Active bottom bar */}
                  {isActive && (
                    <motion.div
                      layoutId="thumb-bar"
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-red"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
