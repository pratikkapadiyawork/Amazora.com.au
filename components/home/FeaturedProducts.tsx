'use client'

import Link     from 'next/link'
import { motion } from 'framer-motion'
import {
  AnimatedSection,
  StaggerContainer,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/components/shared/AnimatedSection'
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
      className={`py-20 px-4 md:px-6 ${bg === 'parchment' ? 'bg-brand-cream' : 'bg-white'}`}
    >
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-red text-[11px] font-bold tracking-[0.22em] uppercase">
              {subtitle}
            </span>
            <h2 className="font-display text-display-md text-brand-navy mt-1">{title}</h2>
          </div>
          <Link href="/shop">
            <motion.span
              whileHover={{ x: 3 }}
              className="text-brand-red font-semibold text-sm hover:text-brand-red-dark transition-colors"
            >
              View all →
            </motion.span>
          </Link>
        </AnimatedSection>

        <StaggerContainer
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map(p => (
            <motion.div key={p.id} variants={staggerItemVariants}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
