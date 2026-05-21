export const SITE = {
  name:           'Amazora',
  tagline:        'Premium gifts, curated for Australians.',
  domain:         'amazora.com.au',
  url:            'https://amazora.com.au',
  email:          'hello@amazora.com.au',
  support:        'support@amazora.com.au',
  phone:          '+61 1300 000 000',
  currency:       'AUD',
  currencySymbol: 'A$',
  locale:         'en-AU',
  timezone:       'Australia/Sydney',
  country:        'AU',
} as const

export const COMMERCE = {
  freeShippingThreshold: 99,
  gstRate:               0.10,
  maxCartQty:            10,
  reviewMinPurchase:     true,
} as const

export const SHIPPING = [
  { id: 'standard',  label: 'Standard Delivery',  price: 9.99,  days: '5–8 business days', carrier: 'Australia Post'           },
  { id: 'express',   label: 'Express Delivery',   price: 14.99, days: '2–3 business days', carrier: 'Australia Post Express'   },
  { id: 'overnight', label: 'Overnight Delivery', price: 24.99, days: '1 business day',    carrier: 'Startrack Overnight'      },
] as const

export const CATEGORIES = [
  { slug: 'chess-sets', name: 'Marble Chess Sets',  emoji: '♟',  image: '/images/cat-chess-sets.jpg',  desc: 'Handcrafted marble chess sets' },
  { slug: 'mugs',       name: 'Premium Mugs',        emoji: '☕', image: '/images/cat-mugs.jpg',        desc: 'Artisan coffee mugs'           },
  { slug: 'leather',    name: 'Leather Accessories', emoji: '👜', image: '/images/cat-leather.jpg',     desc: 'Premium leather goods'         },
  { slug: 'humidors',   name: 'Humidors',            emoji: '🪵', image: '/images/cat-humidors.jpg',    desc: 'Cigar humidors & accessories'  },
  { slug: 'ships',      name: 'Decorative Ships',    emoji: '⚓', image: '/images/cat-ships.jpg',       desc: 'Nautical decor & model ships'  },
  { slug: 'ceramic',    name: 'Ceramic Decor',       emoji: '🏺', image: '/images/cat-ceramic.jpg',     desc: 'Premium ceramic pieces'        },
  { slug: 'hip-flasks', name: 'Hip Flasks',          emoji: '🥃', image: '/images/cat-hip-flasks.jpg',  desc: 'Stylish flask gifts'           },
  { slug: 'gifts',      name: 'Premium Gift Sets',   emoji: '🎁', image: '/images/cat-gifts.jpg',       desc: 'Curated gift collections'      },
] as const

export const PAYMENT_METHODS = [
  { id: 'visa',     label: 'Visa',       bg: '#1A1F71', text: '#fff', abbr: 'VISA'     },
  { id: 'mc',       label: 'Mastercard', bg: '#252525', text: '#fff', abbr: 'MC'       },
  { id: 'amex',     label: 'Amex',       bg: '#007BC1', text: '#fff', abbr: 'AMEX'     },
  { id: 'apple',    label: 'Apple Pay',  bg: '#000000', text: '#fff', abbr: '⬛ Pay'   },
  { id: 'paypal',   label: 'PayPal',     bg: '#003087', text: '#fff', abbr: 'PayPal'   },
  { id: 'afterpay', label: 'Afterpay',   bg: '#B2FCE4', text: '#000', abbr: 'Afterpay' },
  { id: 'klarna',   label: 'Klarna',     bg: '#FFB3C7', text: '#000', abbr: 'Klarna'   },
  { id: 'zip',      label: 'Zip',        bg: '#AA8FFF', text: '#fff', abbr: 'Zip'      },
] as const

export const NAV_LINKS = [
  { href: '/shop',                label: 'Shop All'  },
  { href: '/category/chess-sets', label: 'Chess Sets' },
  { href: '/category/leather',    label: 'Leather'   },
  { href: '/category/humidors',   label: 'Humidors'  },
  { href: '/category/gifts',      label: 'Gift Sets' },
] as const

export function generateOrderNumber(): string {
  const year   = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  return `AMZ-${year}-${random}`
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-AU', {
    style:                 'currency',
    currency:              'AUD',
    minimumFractionDigits: 2,
  }).format(num)
}

export function avgRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}
