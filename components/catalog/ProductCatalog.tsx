'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { useUIStore } from '@/store/uiStore'
import { categoryImage } from '@/lib/category-images'
import type { ProductCard as ProductType } from '@/types'

interface CategoryRow {
  id: string
  slug: string
  name: string
  image: string | null
  count: number
}

interface Props {
  products:   ProductType[]
  categories: CategoryRow[]
  total:      number
}

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most popular' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
]

export function ProductCatalog({ products, categories, total }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const openSearch   = useUIStore(s => s.openSearch)

  const category = searchParams.get('category') ?? ''
  const sort     = searchParams.get('sort') ?? 'popular'
  const q        = searchParams.get('q') ?? ''
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateParams = useCallback(
    (key: string, value: string | undefined) => {
      const sp = new URLSearchParams(searchParams.toString())
      if (value) sp.set(key, value)
      else sp.delete(key)
      sp.delete('page')
      router.push(`/products?${sp.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const activeCategory = categories.find(c => c.slug === category)

  const headerTitle = q
    ? `Search: “${q}”`
    : activeCategory
      ? activeCategory.name
      : 'All Products'

  return (
    <div className="min-h-screen bg-brand-cream pb-28 lg:pb-12">
      <div className="bg-brand-navy text-white pt-8 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-teal/80 text-[11px] font-bold uppercase tracking-[0.22em] mb-2">
            Amazora · Premium Australian Gifts
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-brand-cream">{headerTitle}</h1>
          <p className="text-white/55 mt-2 text-sm">{total} products · amazora.com.au</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Category circles */}
        <section className="bg-white rounded-3xl shadow-sm border border-brand-navy/5 p-4 md:p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-4">
            Shop by category
          </p>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => updateParams('category', undefined)}
              className={`flex-shrink-0 flex flex-col items-center gap-2 ${
                !category ? 'opacity-100' : 'opacity-70'
              }`}
            >
              <div
                className={`w-[72px] h-[72px] md:w-20 md:h-20 rounded-full overflow-hidden border-2 flex items-center justify-center bg-brand-cream ${
                  !category ? 'border-brand-red' : 'border-gray-200'
                }`}
              >
                <span className="text-2xl">✦</span>
              </div>
              <span className="text-[11px] font-semibold text-brand-navy">All</span>
            </button>
            {categories.map(cat => {
              const img = categoryImage(cat.slug, cat.image)
              const active = category === cat.slug
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    updateParams('category', active ? undefined : cat.slug)
                  }
                  className={`flex-shrink-0 flex flex-col items-center gap-2 ${
                    active ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`relative w-[72px] h-[72px] md:w-20 md:h-20 rounded-full overflow-hidden border-2 ${
                      active ? 'border-brand-red ring-2 ring-brand-red/30' : 'border-gray-200'
                    }`}
                  >
                    <Image src={img} alt={cat.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <span className="text-[11px] font-semibold text-brand-navy max-w-[88px] text-center leading-tight">
                    {cat.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex gap-2 mb-6 sticky top-[72px] z-20 bg-brand-cream/95 backdrop-blur-md py-2 -mx-1 px-1">
          <button
            type="button"
            onClick={openSearch}
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-white border border-gray-200 text-brand-navy text-sm font-semibold shadow-sm hover:border-brand-red/40 transition-colors"
          >
            <Search size={18} />
            Search products
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="h-11 px-4 rounded-xl bg-brand-navy text-white text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>

        {/* Active filters */}
        {(category || q || sort !== 'popular') && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-xs font-semibold">
                {activeCategory?.name}
                <button type="button" onClick={() => updateParams('category', undefined)} aria-label="Clear category">
                  <X size={12} />
                </button>
              </span>
            )}
            {q && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-semibold">
                “{q}”
                <button type="button" onClick={() => updateParams('q', undefined)} aria-label="Clear search">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-4xl mb-3">🔍</p>
            <h2 className="text-lg font-bold text-brand-navy">No products found</h2>
            <p className="text-brand-muted text-sm mt-1">Try another category or use search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Filter sheet */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-navy/50 z-[280]"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.aside
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="fixed bottom-0 left-0 right-0 z-[281] bg-white rounded-t-3xl p-6 pb-10 max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-brand-navy text-lg">Filter & sort</h2>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Sort by</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateParams('sort', opt.value === 'popular' ? undefined : opt.value)
                    }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      sort === opt.value
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-brand-cream text-brand-navy border-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateParams('category', undefined)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                    !category ? 'bg-brand-red text-white border-brand-red' : 'border-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateParams('category', cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      category === cat.slug
                        ? 'bg-brand-red text-white border-brand-red'
                        : 'border-gray-200 text-brand-navy'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full mt-8 h-12 rounded-xl bg-brand-red text-white font-bold"
              >
                Show {total} products
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
