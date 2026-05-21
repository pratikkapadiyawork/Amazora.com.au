import type { Metadata }    from 'next'
import { notFound }         from 'next/navigation'
import Link                 from 'next/link'
import { prisma }           from '@/lib/db'
import { ProductCard }      from '@/components/shop/ProductCard'
import { SmartImage }       from '@/components/shared/SmartImage'
import type { ProductCard as T } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })
  return categories.map(c => ({ slug: c.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cat = await prisma.category.findUnique({ where: { slug } }).catch(() => null)
  if (!cat) return { title: 'Category Not Found | Amazora' }
  return {
    title:       `${cat.name} | Amazora`,
    description: cat.description ?? `Browse our ${cat.name} collection. Free delivery over A$99.`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params

  const [category, products] = await Promise.all([
    prisma.category.findUnique({ where: { slug } }).catch(() => null),
    prisma.product.findMany({
      where:   { category: { slug }, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews:  { where: { isApproved: true }, select: { rating: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }).catch(() => [] as T[]),
  ])

  if (!category) notFound()

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Category hero */}
      <div className="relative bg-brand-navy text-white py-16 px-4 overflow-hidden">
        {category.image && (
          <div className="absolute inset-0 opacity-20">
            <SmartImage
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
              sizes="100vw"
              fallbackGradient="from-brand-navy to-brand-steel"
            />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-white/70 max-w-xl">{category.description}</p>
          )}
          <p className="text-white/50 text-sm mt-2">{products.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {(products as T[]).length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">📦</p>
            <h2 className="text-xl font-semibold text-brand-navy">Coming soon</h2>
            <p className="text-brand-muted mt-2">Products are on their way.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {(products as T[]).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
