import { prisma }              from '@/lib/db'
import { HeroSection }         from '@/components/home/HeroSection'
import { SummerSaleShowcase }  from '@/components/home/SummerSaleShowcase'
import { TrustBar }            from '@/components/home/TrustBar'
import { CategoryGrid }        from '@/components/home/CategoryGrid'
import { FeaturedProducts }    from '@/components/home/FeaturedProducts'
import { BrandStory }          from '@/components/home/BrandStory'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { NewsletterCTA }       from '@/components/home/NewsletterCTA'
import type { Metadata }       from 'next'
import type { ProductCard }    from '@/types'
import type { Category }       from '@prisma/client'
import { DEFAULT_KEYWORDS, websiteJsonLd } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title:       'Amazora — Premium Gifts & Lifestyle | Australia',
  description:
    'Shop Amazora Australia — premium gifts, marble chess sets, leather accessories, humidors, hip flasks & unique Australian gifts. Fast delivery. Free shipping over A$99.',
  keywords:    DEFAULT_KEYWORDS,
  alternates:  { canonical: 'https://amazora.com.au' },
  openGraph: {
    title:       'Amazora — Premium Gifts Australia | amazora.com.au',
    description: 'Australia\'s premium gift marketplace. Search Amazora for curated luxury gifts with free delivery over A$99.',
    url:         'https://amazora.com.au',
    locale:      'en_AU',
    images:      [{ url: '/images/australia_special.jpeg', width: 1200, height: 630, alt: 'Amazora Australian premium gifts' }],
  },
}

export default async function HomePage() {
  let featured:   ProductCard[] = []
  let recent:     ProductCard[] = []
  let categories: Category[]    = []

  try {
    const [f, r, c] = await Promise.all([
      prisma.product.findMany({
        where:   { isActive: true, isFeatured: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          reviews:  { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.product.findMany({
        where:   { isActive: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          reviews:  { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])
    featured   = f as unknown as ProductCard[]
    recent     = r as unknown as ProductCard[]
    categories = c
  } catch (err) {
    console.error('Homepage DB fetch failed:', err)
  }

  const jsonLd = websiteJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="overflow-x-hidden">
        <HeroSection />
        <SummerSaleShowcase />
        <TrustBar />
        <CategoryGrid categories={categories} />
        <FeaturedProducts
          products={featured}
          title="Featured Collection"
          subtitle="Handpicked premium gifts"
          id="featured"
        />
        <BrandStory />
        <FeaturedProducts
          products={recent}
          title="New Arrivals"
          subtitle="Just landed"
          id="new-arrivals"
          bg="parchment"
        />
        <TestimonialsSection />
        <NewsletterCTA />
      </div>
    </>
  )
}
