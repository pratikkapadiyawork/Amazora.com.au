import { prisma }         from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q     = searchParams.get('q')?.trim() ?? ''
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '8'), 20)

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], total: 0 })
  }

  const where = {
    isActive: true,
    OR: [
      { name:        { contains: q, mode: 'insensitive' as const } },
      { description: { contains: q, mode: 'insensitive' as const } },
      { tags:        { hasSome: [q.toLowerCase()] } },
      { category:    { name: { contains: q, mode: 'insensitive' as const } } },
    ],
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id:     true,
        slug:   true,
        name:   true,
        price:  true,
        images: true,
        category: { select: { name: true } },
      },
      take:    limit,
      orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({
    products: products.map(p => ({
      ...p,
      price: Number(p.price),
      image: p.images[0] ?? '/images/product-placeholder.jpg',
    })),
    total,
  })
}
