'use client'

import Link from 'next/link'
import { RevealHeading } from '@/components/shared/RevealHeading'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export interface VaultItem {
  id: string
  slug: string
  name: string
  variant: string
  image: string
  images: string[]
  price: number
  comparePrice: number | null
  shortDesc: string | null
}

export interface VaultCollection {
  key: string
  title: string
  kicker: string
  items: VaultItem[]
}

export function CollectorsVault({ collections }: { collections: VaultCollection[] }) {
  const [tab, setTab] = useState(0)
  const [sel, setSel] = useState(0)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const col = collections[tab]
  const item = col?.items[sel] ?? col?.items[0]
  const off = useMemo(
    () => (item?.comparePrice && item.comparePrice > item.price ? Math.round((1 - item.price / item.comparePrice) * 100) : 0),
    [item],
  )
  if (!col || !item) return null

  const add = () => {
    addItem({ productId: item.id, name: item.name, slug: item.slug, image: item.image, price: item.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section id="vault" className="relative py-24 px-4 md:px-6 bg-[rgba(11,10,9,0.4)] overflow-hidden scroll-mt-28">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_40%,rgba(217,169,63,0.10),transparent_60%)]" />
      <div className="relative max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2rem,4.4vw,3.4rem)] leading-tight text-[#F4ECDC]">
              The Collector’s Vault
            </RevealHeading>
            <p className="text-[#A99F8C] mt-2 max-w-md">Pick a collection, then the exact edition you want.</p>
          </div>
          {/* Collection tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" role="tablist">
            {collections.map((c, i) => (
              <button
                key={c.key}
                role="tab"
                aria-selected={i === tab}
                onClick={() => { setTab(i); setSel(0) }}
                className={`shrink-0 h-10 px-5 rounded-full text-sm font-semibold transition-all ${
                  i === tab
                    ? 'bg-[linear-gradient(135deg,#FBE7A1,#D9A93F_55%,#B8862B)] text-[#0B0A09]'
                    : 'border border-[#F4ECDC]/15 text-[#CDBE9C] hover:border-[#D9A93F]/60 hover:text-[#F3D27A]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14 items-start">
          {/* Stage */}
          <div className="relative rounded-[28px] p-[1.5px] bg-[linear-gradient(150deg,rgba(251,231,161,0.7),rgba(138,106,31,0.2)_40%,rgba(243,210,122,0.55))]">
            <div className="relative rounded-[27px] overflow-hidden aspect-square sm:aspect-[5/4] product-img-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0"
                >
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 1024px) 100vw, 680px" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              {off > 0 && (
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="bg-[#E11D2E] text-white text-sm font-bold px-3 py-1.5 rounded-sm">Black Friday −{off}%</span>
                </div>
              )}
              <div className="absolute bottom-5 right-5 bg-black/75 backdrop-blur text-[#F4ECDC] text-xs px-3 py-1.5 rounded-full tabular-nums">
                Edition {sel + 1} of {col.items.length}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col glass-panel rounded-[28px] p-6 md:p-8">
            <p className="text-[#A99F8C] text-sm">{col.kicker}</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display font-semibold text-3xl md:text-4xl text-[#F4ECDC] mt-3 leading-tight">{item.variant}</h3>
                <p className="text-[#B9AF9B] mt-4 leading-relaxed">{item.shortDesc}</p>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-display text-4xl text-gold-grad tabular-nums">A${item.price.toFixed(2)}</span>
                  {item.comparePrice && item.comparePrice > item.price && (
                    <span className="text-[#A99F8C] line-through tabular-nums">A${item.comparePrice.toFixed(2)}</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Edition picker */}
            <div className="mt-8">
              <p className="text-sm text-[#A99F8C] mb-3">{col.items.length} editions</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {col.items.map((it, i) => (
                  <button
                    key={it.slug}
                    onClick={() => setSel(i)}
                    aria-label={it.variant}
                    title={it.variant}
                    className={`relative aspect-square rounded-xl overflow-hidden product-img-container ring-offset-2 ring-offset-[#0B0A09] transition-all ${
                      i === sel ? 'ring-2 ring-[#F3D27A]' : 'ring-1 ring-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={it.image} alt="" fill sizes="90px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-3">
              <button
                onClick={add}
                className={`flex-1 min-w-[200px] h-14 rounded-full inline-flex items-center justify-center gap-2 font-bold text-[15px] transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[linear-gradient(135deg,#FBE7A1,#E2B857_40%,#B8862B)] text-[#0B0A09] shadow-[0_10px_30px_rgba(226,184,87,0.3)] hover:shadow-[0_14px_44px_rgba(226,184,87,0.5)]'
                }`}
              >
                {added ? <><Check size={18} /> Added to bag</> : <><ShoppingBag size={18} /> Add to bag</>}
              </button>
              <Link
                href={`/shop/${item.slug}`}
                className="h-14 px-6 rounded-full border border-[#F4ECDC]/20 text-[#F4ECDC] inline-flex items-center gap-2 font-semibold text-[15px] hover:border-[#F3D27A] hover:text-[#F3D27A] transition-colors"
              >
                Details <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
