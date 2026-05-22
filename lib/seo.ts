const SITE = 'https://amazora.com.au'

export const SITE_NAME = 'Amazora'
export const SITE_URL  = SITE

export const DEFAULT_KEYWORDS = [
  'amazora',
  'amazora australia',
  'amazora.com.au',
  'amazora gifts',
  'premium gifts australia',
  'luxury gifts online australia',
  'australian gift shop',
  'gifts delivered australia',
  'marble chess set australia',
  'leather wallet australia',
  'cigar humidor australia',
  'hip flask gift australia',
  'premium mugs australia',
  'ned kelly gift australia',
  'unique australian gifts',
  'gifts for him australia',
  'gifts for her australia',
  'corporate gifts australia',
  'birthday gifts australia',
  'wedding gifts australia',
  'christmas gifts australia',
]

export function productKeywords(input: {
  name: string
  tags?: string[]
  categoryName?: string
  seoKeywords?: string | null
}): string[] {
  const fromSeo = input.seoKeywords
    ? input.seoKeywords.split(',').map(s => s.trim()).filter(Boolean)
    : []
  const fromTags = input.tags ?? []
  const base = [
    input.name,
    `${input.name} australia`,
    `${input.name} buy online`,
    input.categoryName ? `${input.categoryName} australia` : '',
    input.categoryName ? `buy ${input.categoryName} online` : '',
    'amazora',
    'amazora.com.au',
  ].filter(Boolean)

  return [...new Set([...fromSeo, ...fromTags, ...base, ...DEFAULT_KEYWORDS.slice(0, 8)])]
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: SITE_NAME,
        description:
          'Premium Australian gifts — marble chess, leather, humidors, hip flasks and curated lifestyle pieces.',
        inLanguage: 'en-AU',
        publisher: { '@id': `${SITE}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE}/shop?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: SITE_NAME,
        url: SITE,
        logo: `${SITE}/logo.png`,
        description: 'Premium Australian gifting marketplace',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'AU',
        },
        areaServed: { '@type': 'Country', name: 'Australia' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'hello@amazora.com.au',
          availableLanguage: 'English',
        },
        sameAs: [
          'https://instagram.com/amazora.au',
          'https://facebook.com/amazora.au',
        ],
      },
      {
        '@type': 'Store',
        '@id': `${SITE}/#store`,
        name: SITE_NAME,
        url: SITE,
        image: `${SITE}/images/australia_special.jpeg`,
        priceRange: '$$',
        address: { '@type': 'PostalAddress', addressCountry: 'AU' },
        currenciesAccepted: 'AUD',
        paymentAccepted: 'Credit Card',
      },
    ],
  }
}

export function productJsonLd(product: {
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  sku?: string | null
  categoryName: string
}) {
  const url = `${SITE}/shop/${product.slug}`
  const image = product.images[0]?.startsWith('http')
    ? product.images[0]
    : `${SITE}${product.images[0] ?? '/images/australia_special.jpeg'}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image,
    sku: product.sku ?? product.slug,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: product.categoryName,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'AUD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  }
}
