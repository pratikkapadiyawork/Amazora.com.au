import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

function rankScore(name: string, q: string, viewCount: number, featured: boolean): number {
  const n = name.toLowerCase()
  const query = q.toLowerCase()
  let score = viewCount
  if (featured) score += 500
  if (n.startsWith(query)) score += 2000
  else if (n.split(/\s+/).some(w => w.startsWith(query))) score += 1200
  else if (n.includes(query)) score += 600
  return score
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '8', 10), 20)

  if (!q) {
    return NextResponse.json({ products: [], total: 0 })
  }

  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)

  const where = {
    isActive: true,
    OR: [
      { name: { contains: q, mode: 'insensitive' as const } },
      { description: { contains: q, mode: 'insensitive' as const } },
      { shortDesc: { contains: q, mode: 'insensitive' as const } },
      { sku: { contains: q, mode: 'insensitive' as const } },
      { seoKeywords: { contains: q, mode: 'insensitive' as const } },
      ...tokens.map(t => ({ tags: { has: t } })),
      ...tokens.map(t => ({ tags: { hasSome: [t] } })),
      { category: { name: { contains: q, mode: 'insensitive' as const } } },
      { category: { slug: { contains: q, mode: 'insensitive' as const } } },
    ],
  }

  const [raw, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id:         true,
        slug:       true,
        name:       true,
        price:      true,
        images:     true,
        viewCount:  true,
        isFeatured: true,
        category:   { select: { name: true } },
      },
      take: Math.min(limit * 3, 40),
    }),
    prisma.product.count({ where }),
  ])

  const products = raw
    .map(p => ({
      ...p,
      _score: rankScore(p.name, q, p.viewCount, p.isFeatured),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, viewCount, isFeatured, ...p }) => ({
      ...p,
      price: Number(p.price),
      image: p.images[0] ?? '/images/australia_special.jpeg',
    }))

  return NextResponse.json(
    { products, total },
    {
      headers: {
        'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
      },
    },
  )
}
