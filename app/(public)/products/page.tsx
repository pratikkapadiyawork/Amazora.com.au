import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { ProductCatalog } from '@/components/catalog/ProductCatalog'
import { DEFAULT_KEYWORDS } from '@/lib/seo'
import type { ProductCard as T } from '@/types'
import type { Prisma } from '@prisma/client'

export const revalidate = 3600

export const metadata: Metadata = {
  title:       'All Products — Shop by Category | Amazora Australia',
  description:
    'Browse every Amazora product: marble chess, leather gifts, humidors, hip flasks, Ned Kelly figurines & Australian gifts. Filter, search & shop amazora.com.au.',
  keywords: [
    ...DEFAULT_KEYWORDS,
    'amazora shop',
    'amazora products',
    'australia gift shop online',
    'australian gift store',
    'buy gifts australia',
    'premium shop australia',
  ],
  alternates: { canonical: 'https://amazora.com.au/products' },
  openGraph: {
    title:       'Shop All Products | Amazora Australia',
    description: 'Category-wise premium gifts — chess, leather, cigars, Australian icons.',
    url:         'https://amazora.com.au/products',
  },
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    sort?:     string
    q?:        string
    min?:      string
    max?:      string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams

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
        { name:        { contains: params.q, mode: 'insensitive' } },
        { shortDesc:   { contains: params.q, mode: 'insensitive' } },
        { description: { contains: params.q, mode: 'insensitive' } },
        { seoKeywords: { contains: params.q, mode: 'insensitive' } },
        { tags:        { has: params.q.toLowerCase() } },
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
      take: 120,
    }).catch(() => [] as T[]),

    prisma.product.count({ where }).catch(() => 0),

    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        image: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }).catch(() => []),
  ])

  const categoryRows = categories.map(c => ({
    id:    c.id,
    slug:  c.slug,
    name:  c.name,
    image: c.image,
    count: c._count.products,
  }))

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
      <ProductCatalog
        products={products as T[]}
        categories={categoryRows}
        total={total}
      />
    </Suspense>
  )
}
