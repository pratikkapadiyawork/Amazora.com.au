'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { X, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useUIStore }  from '@/store/uiStore'
import { SearchInput } from '@/components/shared/SearchInput'
import { formatPrice } from '@/lib/constants'
import { useDebounce } from '@/hooks/useDebounce'

const POPULAR = [
  'Marble chess set', 'Leather wallet', 'Cigar humidor',
  'Hip flask gift',   'Premium mug',    'Gift set for him',
]

interface SearchResult {
  id:       string
  slug:     string
  name:     string
  image:    string
  price:    number
  category: { name: string }
}

export function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore()
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total,   setTotal]   = useState(0)

  const debouncedQ = useDebounce(query, 120)

  useEffect(() => {
    const q = debouncedQ.trim()
    let cancelled = false
    const id = setTimeout(() => {
      if (cancelled) return
      if (!q) { setResults([]); setTotal(0); return }
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        .then(r => r.json())
        .then(d => { if (!cancelled) { setResults(d.products ?? []); setTotal(d.total ?? 0) } })
        .catch(() => { if (!cancelled) setResults([]) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 0)
    return () => { cancelled = true; clearTimeout(id) }
  }, [debouncedQ])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch() }
    if (searchOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [searchOpen, closeSearch])

  // Lock body
  useEffect(() => {
    document.body.style.overflow = searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [searchOpen])

  const handleClose = () => { closeSearch(); setQuery('') }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-modal flex flex-col"
          style={{ background: 'rgba(12,4,32,0.88)', zIndex: 300 }}
          onClick={e => { if (e.target === e.currentTarget) handleClose() }}
        >
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{ y: -24,    opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-2xl mx-auto px-4 pt-8 pb-4"
          >
            {/* Input row */}
            <div className="flex items-center gap-3">
              <SearchInput
                value={query}
                onChange={setQuery}
                onClear={() => { setQuery(''); setResults([]) }}
                autoFocus
                variant="dark"
                className="flex-1"
                placeholder="Search chess sets, leather goods, humidors..."
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                aria-label="Close search"
                className="flex-shrink-0 w-11 h-11 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Results panel */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 glass-dark rounded-2xl overflow-hidden border border-white/10 max-h-[70vh] overflow-y-auto scrollbar-hide"
            >
              {/* Loading skeleton */}
              {loading && (
                <div className="p-5 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-11 h-11 rounded-lg skeleton-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 skeleton-pulse rounded" />
                        <div className="h-3 w-1/3 skeleton-pulse rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div>
                  <p className="px-4 py-2.5 text-xs font-semibold text-white/35 uppercase tracking-wider border-b border-white/[0.08]">
                    {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                  </p>
                  {results.map((product, i) => (
                    <Link key={product.id} href={`/shop/${product.slug}`} onClick={handleClose}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/[0.05] last:border-0"
                      >
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-brand-cream">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-brand-red transition-colors">
                            {product.name}
                          </p>
                          <p className="text-white/40 text-xs">{product.category.name}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-brand-red font-bold text-sm">
                            {formatPrice(product.price)}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-white/20 group-hover:text-brand-red transition-colors"
                          />
                        </div>
                      </motion.div>
                    </Link>
                  ))}

                  {total > 8 && (
                    <Link
                      href={`/shop?q=${encodeURIComponent(query)}`}
                      onClick={handleClose}
                    >
                      <div className="flex items-center justify-center gap-1.5 py-3 text-brand-red text-sm font-semibold hover:bg-white/5 transition-colors border-t border-white/[0.08]">
                        View all {total} results for &ldquo;{query}&rdquo;
                        <ArrowUpRight size={14} />
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {/* No results */}
              {!loading && query.trim() && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-white/60 text-sm">
                    No products found for{' '}
                    <span className="text-brand-red">&ldquo;{query}&rdquo;</span>
                  </p>
                  <p className="text-white/35 text-xs mt-1">
                    Try &ldquo;chess set&rdquo;, &ldquo;leather wallet&rdquo;, or &ldquo;gift set&rdquo;
                  </p>
                </div>
              )}

              {/* Popular searches */}
              {!query && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-brand-red/60" />
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                      Popular searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map(term => (
                      <motion.button
                        key={term}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full glass-card border border-white/10 text-white/60 hover:text-brand-red hover:border-brand-red/30 text-xs font-medium transition-all"
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
