import { prisma }              from '@/lib/db'
import { HeroSection }         from '@/components/home/HeroSection'
import { TrustBar }            from '@/components/home/TrustBar'
import { CategoryGrid, type CategoryTile } from '@/components/home/CategoryGrid'
import { CollectorsVault, type VaultCollection } from '@/components/home/CollectorsVault'
import { DealTicker }          from '@/components/home/DealTicker'
import { Showroom }            from '@/components/home/Showroom'
import { KeychainWall }        from '@/components/home/KeychainWall'
import catalog                 from '@/lib/catalog-data.json'
import { FeaturedProducts }    from '@/components/home/FeaturedProducts'
import { BrandStory }          from '@/components/home/BrandStory'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { NewsletterCTA }       from '@/components/home/NewsletterCTA'
import type { Metadata }       from 'next'
import type { ProductCard }    from '@/types'
import { DEFAULT_KEYWORDS, websiteJsonLd } from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title:       'Black Friday Sale — Premium Gifts Australia | Amazora',
  description:
    'Amazora Black Friday — 20% off premium gifts: Ned Kelly figurines, marble chess sets, milestone tankards, hip flasks, humidors and model planes. Free AU shipping over A$99.',
  keywords:    DEFAULT_KEYWORDS,
  alternates:  { canonical: 'https://amazora.com.au' },
  openGraph: {
    title:       'Amazora — Premium Gifts Australia | amazora.com.au',
    description: 'Australia\'s premium gift marketplace. Search Amazora for curated luxury gifts with free delivery over A$99.',
    url:         'https://amazora.com.au',
    locale:      'en_AU',
    images:      [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Amazora Black Friday — premium gifts Australia' }],
  },
}

export default async function HomePage() {
  let products: ProductCard[] = []
  let categories: { id: string; slug: string; name: string }[] = []

  try {
    const [p, c] = await Promise.all([
      prisma.product.findMany({
        where:   { isActive: true },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          reviews:  { where: { isApproved: true }, select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({ orderBy: { sortOrder: 'asc' }, select: { id: true, slug: true, name: true } }),
    ])
    products   = p as unknown as ProductCard[]
    categories = c
  } catch (err) {
    console.error('Homepage DB fetch failed:', err)
  }

  const bySlug  = new Map(products.map(p => [p.slug, p]))
  const groupOf = new Map((catalog as { slug: string; group: string }[]).map(c => [c.slug, c.group]))
  const num     = (v: unknown) => (v == null ? null : Number(v))
  const variantOf = (name: string) => (name.includes(' — ') ? name.split(' — ').slice(1).join(' — ') : name)

  // 3D showroom — one standout piece from each family
  const showSlugs = [
    'ned-kelly-1-gun-large-bronze', 'chess-black-and-coral', 'guitar-style-4', 'model-plane-emirates-a380',
    'big-ship-classic-galleon', 'brass-tudor-mug-21st-birthday', 'humidor', 'hip-flask-jack-daniels-tribute',
    'cigar-cutter-with-torch-lighter-black', 'marble-ashtray-style-3', 'swan-vase-sculptural', 'belt-style-2',
    'ned-kelly-arm-extended-copper', 'guitar-style-3', 'keychain-ferrari', 'manicure-set-deluxe-leather-case',
  ]
  const showroom = showSlugs.map(s => bySlug.get(s)).filter(Boolean).map(p => ({
    id: p!.id, slug: p!.slug, name: p!.name, category: p!.category.name, image: p!.images[0],
    price: Number(p!.price), comparePrice: num(p!.comparePrice),
  }))

  // Collector's vault — one tab per product family
  const VAULT: { group: string; title: string; kicker: string }[] = [
    { group: 'Ned Kelly Figurine',       title: 'Ned Kelly',   kicker: 'Australia’s most famous bushranger, cast and hand-finished.' },
    { group: 'Miniature Display Guitar', title: 'Guitars',     kicker: 'Rock-and-roll legends in miniature — stand included.' },
    { group: 'Model Plane',              title: 'Airliners',   kicker: 'Authentic airline liveries on a clear display stand.' },
    { group: 'Brass Tudor Mug',          title: 'Tankards',    kicker: 'The milestone birthday gift, crested in brass.' },
    { group: 'Hip Flask',                title: 'Hip Flasks',  kicker: 'Pocket-sized, leak-proof and engraved for the occasion.' },
    { group: '12" Marble Chess Set',     title: 'Chess',       kicker: 'Hand-cut natural marble — every board is one of a kind.' },
  ]
  const vault: VaultCollection[] = VAULT.map(v => ({
    key: v.group, title: v.title, kicker: v.kicker,
    items: products
      .filter(p => groupOf.get(p.slug) === v.group)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .map(p => ({
        id: p.id, slug: p.slug, name: p.name, variant: v.group === 'Model Plane' ? p.name : variantOf(p.name),
        image: p.images[0], images: p.images, price: Number(p.price), comparePrice: num(p.comparePrice), shortDesc: p.shortDesc,
      })),
  })).filter(v => v.items.length > 0)

  const keychains = products
    .filter(p => groupOf.get(p.slug) === 'Car Logo Keychain')
    .map(p => ({ slug: p.slug, brand: p.name.replace(' Logo Keychain', ''), image: p.images[0], price: Number(p.price), comparePrice: num(p.comparePrice) }))

  const tiles: CategoryTile[] = categories.map(c => {
    const inCat = products.filter(p => p.category.slug === c.slug)
    const cover = inCat.find(p => p.isFeatured) ?? inCat[0]
    return { ...c, count: inCat.length, cover: cover?.images[0] ?? null }
  }).filter(t => (t.count ?? 0) > 0)

  const featured = products.filter(p => p.isFeatured).slice(0, 8)
  const newest   = products.filter(p => groupOf.get(p.slug) !== 'Car Logo Keychain' && !p.isFeatured).slice(0, 8)
  const ticker   = [...featured, ...newest].slice(0, 14).map(p => ({ slug: p.slug, name: p.name, price: Number(p.price), comparePrice: num(p.comparePrice) }))

  const jsonLd = websiteJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="overflow-x-hidden bg-[rgba(11,10,9,0.4)]">
        <HeroSection />
        <DealTicker items={ticker} />
        <div id="showroom" className="scroll-mt-24"><Showroom products={showroom} /></div>
        <TrustBar />
        <CollectorsVault collections={vault} />
        <CategoryGrid categories={tiles} />
        <FeaturedProducts
          products={featured}
          title="Black Friday Icons"
          subtitle="The pieces we would gift first, all 20% off."
          id="featured"
          bg="parchment"
        />
        <KeychainWall items={keychains} />
        <BrandStory
          images={[bySlug.get('ned-kelly-1-gun-small-copper')?.images[0], bySlug.get('chess-green-and-white')?.images[0], bySlug.get('keychain-porsche')?.images[0]].filter(Boolean) as string[]}
          stats={{ pieces: products.length, marques: keychains.length, collections: tiles.length }}
        />
        <FeaturedProducts
          products={newest}
          title="Just Landed"
          subtitle="New to Amazora this season."
          id="new-arrivals"
        />
        <TestimonialsSection />
        <NewsletterCTA />
      </div>
    </>
  )
}
