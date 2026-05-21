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

export const revalidate = 3600

export const metadata: Metadata = {
  title:       'Amazora — Premium Gifts & Lifestyle | Australia',
  description: 'Discover curated premium gifts: marble chess sets, leather accessories, humidors, hip flasks. Free AU delivery over A$99. Trusted by Australians.',
  openGraph: {
    title:       'Amazora — Premium Gifts & Lifestyle | Australia',
    description: 'Curated premium gifts. Free AU delivery. Trusted by Australians.',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630 }],
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

  const orgJsonLd = {
    '@context':    'https://schema.org',
    '@type':       'Organization',
    name:          'Amazora',
    url:           'https://amazora.com.au',
    logo:          'https://amazora.com.au/logo.png',
    description:   'Premium Australian lifestyle and gifting marketplace',
    address:       { '@type': 'PostalAddress', addressCountry: 'AU' },
    contactPoint:  { '@type': 'ContactPoint', contactType: 'customer service', email: 'hello@amazora.com.au' },
    sameAs:        ['https://instagram.com/amazora.au', 'https://facebook.com/amazora.au'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
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
