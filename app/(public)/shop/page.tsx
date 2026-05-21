import { Suspense }          from 'react'
import type { Metadata }    from 'next'
import { prisma }           from '@/lib/db'
import { ProductCard }      from '@/components/shop/ProductCard'
import { ShopFiltersBar }   from '@/components/shop/ShopFiltersBar'
import type { ProductCard as T } from '@/types'
import type { Prisma }      from '@prisma/client'

export const revalidate = 3600

export const metadata: Metadata = {
  title:       'Shop All Products | Amazora',
  description: 'Browse our complete collection of premium gifts — marble chess sets, leather accessories, hip flasks, humidors and more. Free delivery over A$99.',
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?:     string
    q?:        string
    page?:     string
    min?:      string
    max?:      string
  }>
}

const PAGE_SIZE = 24

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page   = Math.max(1, parseInt(params.page ?? '1', 10))
  const skip   = (page - 1) * PAGE_SIZE

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === 'price-asc'  ? { price: 'asc'  } :
    params.sort === 'price-desc' ? { price: 'desc' } :
    params.sort === 'newest'     ? { createdAt: 'desc' } :
                                   { viewCount: 'desc' }

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.category && { category: { slug: params.category } }),
    ...(params.q && {
      OR: [
        { name:      { contains: params.q, mode: 'insensitive' } },
        { shortDesc: { contains: params.q, mode: 'insensitive' } },
        { tags:      { has: params.q.toLowerCase() } },
      ],
    }),
    ...(params.min && { price: { gte: parseFloat(params.min) } }),
    ...(params.max && { price: { lte: parseFloat(params.max) } }),
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews:  { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }).catch(() => [] as T[]),

    prisma.product.count({ where }).catch(() => 0),

    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select:  { id: true, slug: true, name: true },
    }).catch(() => []),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-navy text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-brand-teal/70 text-xs font-bold uppercase tracking-widest mb-2">Amazora</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            {params.q ? `Search: "${params.q}"` : 'Shop All Products'}
          </h1>
          <p className="text-white/60 mt-2">{total} {total === 1 ? 'product' : 'products'} available</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters — wrapped in Suspense because it reads useSearchParams */}
        <Suspense fallback={<div className="h-12" />}>
          <ShopFiltersBar
            categories={categories}
            currentCategory={params.category}
            currentSort={params.sort}
          />
        </Suspense>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold text-brand-navy mb-2">No products found</h2>
            <p className="text-brand-muted">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(products as T[]).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <a
                key={p}
                href={`/shop?${new URLSearchParams({ ...params, page: String(p) })}`}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                  p === page
                    ? 'bg-brand-red text-white'
                    : 'bg-white text-brand-navy hover:bg-brand-red/10'
                }`}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
