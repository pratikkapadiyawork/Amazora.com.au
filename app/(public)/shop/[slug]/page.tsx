import type { Metadata }     from 'next'
import { notFound }          from 'next/navigation'
import { prisma }            from '@/lib/db'
import { ProductDetail }     from '@/components/shop/ProductDetail'
import { ProductCard }       from '@/components/shop/ProductCard'
import type { ProductCard as T } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where:  { isActive: true },
    select: { slug: true },
  })
  return products.map(p => ({ slug: p.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product  = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDesc: true, images: true, seoTitle: true, seoDesc: true },
  }).catch(() => null)

  if (!product) return { title: 'Product Not Found | Amazora' }

  return {
    title:       product.seoTitle ?? `${product.name} | Amazora`,
    description: product.seoDesc  ?? product.shortDesc ?? '',
    openGraph: {
      title:  product.name,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const [product] = await Promise.all([
    prisma.product.findUnique({
      where:   { slug, isActive: true },
      include: {
        category: true,
        reviews:  {
          where:   { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take:    10,
        },
        variants: true,
      },
    }).catch(() => null),
  ])

  if (!product) notFound()

  // Fetch related products after we have the product
  const relatedProducts = await prisma.product.findMany({
    where:   { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      reviews:  { where: { isApproved: true }, select: { rating: true } },
    },
    take:    4,
    orderBy: { isFeatured: 'desc' },
  }).catch(() => [] as T[])

  // Increment view count (fire and forget)
  prisma.product.update({
    where: { id: product.id },
    data:  { viewCount: { increment: 1 } },
  }).catch(() => null)

  return (
    <div className="min-h-screen bg-brand-cream">
      <ProductDetail product={product} />

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-brand-navy mb-8">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(relatedProducts as T[]).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
