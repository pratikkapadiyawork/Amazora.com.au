'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback }                from 'react'

interface Props {
  categories:      { id: string; slug: string; name: string }[]
  currentCategory?: string
  currentSort?:     string
}

const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular'  },
  { value: 'newest',     label: 'Newest First'  },
  { value: 'price-asc',  label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
]

export function ShopFiltersBar({ categories, currentCategory, currentSort }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string | undefined) => {
    const sp = new URLSearchParams(searchParams.toString())
    if (value) sp.set(key, value)
    else       sp.delete(key)
    sp.delete('page')
    router.push(`/shop?${sp.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex flex-wrap gap-3 mb-8 items-center">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update('category', undefined)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            !currentCategory
              ? 'bg-brand-navy text-white border-brand-navy'
              : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => update('category', cat.slug === currentCategory ? undefined : cat.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              cat.slug === currentCategory
                ? 'bg-brand-navy text-white border-brand-navy'
                : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="ml-auto">
        <select
          value={currentSort ?? 'popular'}
          onChange={e => update('sort', e.target.value)}
          className="text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-white text-brand-navy focus:outline-none focus:border-brand-navy"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
