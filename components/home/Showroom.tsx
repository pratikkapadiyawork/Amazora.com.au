'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { RevealHeading } from '@/components/shared/RevealHeading'

const ShowroomScene = dynamic(() => import('@/components/three/ShowroomScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 grid place-items-center text-[#A99F8C] text-sm">Opening the showroom…</div>,
})

export interface ShowroomProduct {
  id: string; slug: string; name: string; category: string; image: string; price: number; comparePrice: number | null
}

export function Showroom({ products }: { products: ShowroomProduct[] }) {
  const [i, setI] = useState(0)
  const [added, setAdded] = useState(false)
  const router = useRouter()
  const stage = useRef<HTMLDivElement>(null)
  const addItem = useCartStore(s => s.addItem)
  const sceneItems = useMemo(() => products.map(x => ({ slug: x.slug, image: x.image })), [products])

  const onFocus = useCallback((n: number) => setI(n), [])
  const onOpen = useCallback((n: number) => router.push(`/shop/${products[n].slug}`), [products, router])
  const nudge = (d: number) => stage.current?.querySelector('[tabindex]')?.dispatchEvent(new CustomEvent('showroom:nudge', { detail: d }))

  if (!products.length) return null
  const p = products[i] ?? products[0]
  const off = p.comparePrice && p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0

  const add = () => {
    addItem({ productId: p.id, name: p.name, slug: p.slug, image: p.image, price: p.price })
    setAdded(true); setTimeout(() => setAdded(false), 1600)
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#1E1810_0%,#0B0A09_62%)] pt-24 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center">
        <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] text-[#F4ECDC]">
          The Showroom
        </RevealHeading>
        <p className="text-[#A99F8C] mt-3">Drag to turn the display. Tap the piece in front to see it up close.</p>
      </div>

      <div ref={stage} className="relative h-[420px] sm:h-[520px] lg:h-[600px] mt-6">
        <ShowroomScene items={sceneItems} onFocus={onFocus} onOpen={onOpen} className="absolute inset-0 outline-none" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0A09] to-transparent" />
        <button onClick={() => nudge(1)} aria-label="Previous piece" className="absolute left-3 md:left-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#F3D27A]/40 bg-black/40 backdrop-blur text-[#F3D27A] grid place-items-center hover:bg-[#F3D27A] hover:text-[#0B0A09] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => nudge(-1)} aria-label="Next piece" className="absolute right-3 md:right-10 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#F3D27A]/40 bg-black/40 backdrop-blur text-[#F3D27A] grid place-items-center hover:bg-[#F3D27A] hover:text-[#0B0A09] transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="relative max-w-xl mx-auto px-4 text-center min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div key={p.slug} initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }} transition={{ duration: 0.35 }}>
            <p className="text-sm text-[#D9A93F]">{p.category}</p>
            <Link href={`/shop/${p.slug}`} className="block font-display font-semibold text-2xl md:text-3xl text-[#F4ECDC] mt-1 hover:text-[#F3D27A] transition-colors">{p.name}</Link>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-[#F3D27A] tabular-nums">A${p.price.toFixed(2)}</span>
              {off > 0 && <span className="text-[#A99F8C] line-through tabular-nums">A${p.comparePrice!.toFixed(2)}</span>}
              {off > 0 && <span className="bg-[#E11D2E] text-white text-xs font-bold px-2 py-1 rounded-sm">−{off}%</span>}
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={add} className={`mt-5 h-12 px-7 rounded-full inline-flex items-center gap-2 font-bold transition-all ${added ? 'bg-emerald-500 text-white' : 'bg-[linear-gradient(135deg,#FBE7A1,#E2B857_40%,#B8862B)] text-[#0B0A09] shadow-[0_10px_30px_rgba(226,184,87,0.3)]'}`}>
          {added ? <><Check size={17} /> Added to bag</> : <><ShoppingBag size={17} /> Add to bag</>}
        </button>
      </div>
    </section>
  )
}
