'use client'

import Link     from 'next/link'
import { RevealHeading, Reveal } from '@/components/shared/RevealHeading'
import { motion } from 'framer-motion'

import { ProductCard }       from '@/components/shop/ProductCard'
import type { ProductCard as T } from '@/types'

interface Props {
  products: T[]
  title:    string
  subtitle: string
  id:       string
  bg?:      'white' | 'parchment'
}

export function FeaturedProducts({ products, title, subtitle, id, bg = 'white' }: Props) {
  if (!products.length) return null

  return (
    <section
      id={id}
      className={`py-24 px-4 md:px-6 ${bg === 'parchment' ? 'bg-[#0F0D0B]' : 'bg-[#0B0A09]'}`}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <RevealHeading as="h2" className="font-display font-semibold text-[clamp(2rem,4.4vw,3.4rem)] leading-tight text-[#F4ECDC]">{title}</RevealHeading>
            <p className="text-[#A99F8C] mt-2">{subtitle}</p>
          </div>
          <Link href="/shop">
            <motion.span
              whileHover={{ x: 3 }}
              className="text-[#F3D27A] font-semibold hover:text-white transition-colors"
            >
              View all
            </motion.span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
