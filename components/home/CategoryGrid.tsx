'use client'

import Link from 'next/link'
import { RevealHeading, Reveal } from '@/components/shared/RevealHeading'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { categoryImage } from '@/lib/category-images'

export interface CategoryTile { id: string; slug: string; name: string; count?: number; cover?: string | null }

// bento spans for 8 tiles on desktop
const SPANS = ['lg:col-span-2 lg:row-span-2', '', '', 'lg:col-span-2', '', '', '', '']

export function CategoryGrid({ categories }: { categories: CategoryTile[] }) {
  if (!categories.length) return null
  return (
    <section className="py-24 px-4 md:px-6 bg-[rgba(11,10,9,0.4)]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div>
            <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2rem,4.4vw,3.4rem)] leading-tight text-[#F4ECDC]">
              Shop by collection
            </RevealHeading>
            <p className="text-[#A99F8C] mt-2">Every collection is part of the Black Friday sale.</p>
          </div>
          <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-[#F3D27A] font-semibold hover:text-white transition-colors">
            View all <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-3 md:gap-4">
          {categories.slice(0, 8).map((c, i) => (
            <Reveal
              key={c.slug}
              delay={i * 0.06}
              className={`${SPANS[i] ?? ''} ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <Link
                href={`/category/${c.slug}`}
                className="group relative block h-full rounded-[22px] overflow-hidden ring-1 ring-white/5 hover:ring-[#F3D27A]/60 transition-all product-img-container"
              >
                <Image
                  src={c.cover || categoryImage(c.slug)}
                  alt={c.name}
                  fill
                  sizes={i === 0 ? '(max-width: 1024px) 100vw, 640px' : '(max-width: 1024px) 50vw, 320px'}
                  className="object-cover group-hover:scale-105 transition-transform duration-[900ms]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,10,9,0)_35%,rgba(11,10,9,0.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex items-end justify-between gap-3">
                  <div>
                    {typeof c.count === 'number' && (
                      <p className="text-xs text-[#F3D27A]">{c.count} {c.count === 1 ? 'piece' : 'pieces'}</p>
                    )}
                    <h3 className={`font-display font-semibold text-[#F4ECDC] leading-tight mt-1 ${i === 0 ? 'text-2xl md:text-4xl' : 'text-base md:text-lg'}`}>
                      {c.name}
                    </h3>
                  </div>
                  <span className="w-10 h-10 shrink-0 rounded-full border border-[#F3D27A]/50 text-[#F3D27A] flex items-center justify-center group-hover:bg-[#F3D27A] group-hover:text-[#0B0A09] transition-colors">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
