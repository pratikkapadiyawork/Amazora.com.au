import { prisma } from '@/lib/db'
import { ProductCard } from '@/components/shop/ProductCard'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Gifts for Her — Premium Gifts for Women | Amazora Australia",
  description: "Discover thoughtful gifts for her: ceramic vases, artisan mugs, curated gift sets and elegant home decor. Free AU delivery over A$99.",
}
export const revalidate = 3600

export default async function ForHerPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: { in: ['ceramic', 'mugs', 'gifts'] } },
    },
    include: {
      category: { select: { name: true, slug: true } },
      reviews: { where: { isApproved: true }, select: { rating: true } },
    },
    orderBy: { price: 'asc' },
    take: 24,
  })

  return (
    <div style={{ background: '#f1faee', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(160deg, #1d3557 0%, #457b9d 100%)' }} className="py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm mb-5 font-body" style={{ color: 'rgba(168,218,220,0.55)' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: '#f1faee' }}>Gifts for Her</span>
          </nav>
          <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: '#a8dadc' }}>Gift Ideas · For Her</span>
          <h1 className="font-display mt-3 mb-4" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f1faee' }}>
            Premium Gifts for Her
          </h1>
          <p className="font-body max-w-xl" style={{ color: 'rgba(168,218,220,0.65)' }}>
            Ceramic vases, artisan mugs and curated gift sets. Something she&apos;ll love and remember.
          </p>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map(p => <ProductCard key={p.id} product={p as any} />)}
        </div>
      </div>
    </div>
  )
}
