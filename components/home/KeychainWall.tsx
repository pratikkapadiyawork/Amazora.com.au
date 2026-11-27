'use client'

import Link from 'next/link'
import { RevealHeading } from '@/components/shared/RevealHeading'
import Image from 'next/image'
import { useState } from 'react'
import { AnimeGrid } from '@/components/motion/AnimeGrid'

export interface KeyItem { slug: string; brand: string; image: string; price: number; comparePrice: number | null }

export function KeychainWall({ items }: { items: KeyItem[] }) {
  const [all, setAll] = useState(false)
  if (!items.length) return null
  const shown = all ? items : items.slice(0, 18)
  const p = items[0]

  return (
    <section className="relative py-24 px-4 md:px-6 bg-[rgba(14,12,10,0.4)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[0.8fr_1.6fr] gap-12 items-start">
          <div className="lg:sticky lg:top-36 glass-panel rounded-[24px] p-6 md:p-8">
            <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2rem,4vw,3.2rem)] leading-tight text-[#F4ECDC]">
              The Marque Wall
            </RevealHeading>
            <p className="text-[#B9AF9B] mt-4 leading-relaxed">
              {items.length} solid-metal car logo keychains — from Holden and Ford to Ferrari, Porsche and Tesla.
              The easiest stocking-filler of the season.
            </p>
            <p className="mt-6 font-display text-3xl text-gold-grad tabular-nums">
              A${p.price.toFixed(2)}
              {p.comparePrice && p.comparePrice > p.price && (
                <span className="ml-3 text-base text-[#A99F8C] line-through font-sans">A${p.comparePrice.toFixed(2)}</span>
              )}
            </p>
            <p className="text-[#A99F8C] text-sm mt-1">each, any marque</p>
          </div>

          <div>
            <AnimeGrid key={all ? 'all' : 'some'} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {shown.map(k => (
                <Link
                  key={k.slug}
                  href={`/shop/${k.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] product-img-container ring-1 ring-white/5 hover:ring-[#F3D27A]/70 transition-all"
                >
                  <Image src={k.image} alt={`${k.brand} keychain`} fill sizes="160px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-2 pt-8 bg-gradient-to-t from-black/85 to-transparent">
                    <p className="text-[11px] font-semibold text-white tracking-wide truncate">{k.brand}</p>
                  </div>
                </Link>
              ))}
            </AnimeGrid>
            {items.length > 18 && (
              <button
                onClick={() => setAll(v => !v)}
                className="mt-6 h-11 px-6 rounded-full border border-[#F4ECDC]/20 text-[#F4ECDC] text-sm font-semibold hover:border-[#F3D27A] hover:text-[#F3D27A] transition-colors"
              >
                {all ? 'Show fewer' : `Show all ${items.length} marques`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
