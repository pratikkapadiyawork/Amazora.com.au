/**
 * Summer Sale Price Updater
 * Sets 5% off prices for the 4 featured summer sale products.
 * Run: npx tsx scripts/update-summer-sale.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SALE_ENDS = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now

const SUMMER_PRODUCTS = [
  {
    slug:         'ned-kelly-1-gun-bronze',
    salePrice:    47.45,
    origPrice:    49.95,
    images:       [
      '/products/ned-kelly-bronze-main.jpg',
      '/products/ned-kelly--bronze--2.jpeg',
      '/products/ned-kelly--bronze--3.jpeg',
      '/products/ned-kelly--bronze--4.jpeg',
    ],
  },
  {
    slug:         'miniature-guitar-acoustic',
    salePrice:    28.45,
    origPrice:    29.95,
    images:       [
      '/products/guitar-main.jpg',
      '/products/guitar--g-1--2.jpg',
      '/products/guitar--g-1--3.jpg',
      '/products/guitar--g-1--4.jpg',
    ],
  },
  {
    slug:         'cigar-cutter-cc1',
    salePrice:    14.20,
    origPrice:    14.95,
    images:       [
      '/products/cigar-cutter-main.jpg',
      '/products/cigar-cutter--cc1-1495--2.jpg',
      '/products/cigar-cutter--cc1-1495--3.png',
      '/products/cigar-cutter--cc1-1495--4.jpg',
    ],
  },
  {
    slug:         'marble-ashtray-m1',
    salePrice:    33.20,
    origPrice:    34.95,
    images:       [
      '/products/marble-ashtray-main.jpg',
      '/products/marble-ashtray--m-1--2.jpg',
      '/products/marble-ashtray--m-1--3.jpg',
      '/products/marble-ashtray--m-2--4.jpg',
    ],
  },
]

async function main() {
  console.log('🌞 Applying Summer Sale prices...\n')

  for (const p of SUMMER_PRODUCTS) {
    const saving = (p.origPrice - p.salePrice).toFixed(2)
    try {
      await prisma.product.upsert({
        where:  { slug: p.slug },
        update: {
          price:        p.salePrice,
          comparePrice: p.origPrice,
          isOnSale:     true,
          salePercent:  5,
          saleLabel:    'Summer Sale',
          saleEndsAt:   SALE_ENDS,
          isFeatured:   true,
          isActive:     true,
          images:       p.images,
          tags: {
            push: 'summer-sale',
          },
        },
        create: {
          slug:         p.slug,
          name:         p.slug
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          description:  'Premium Australian gift. Summer sale — limited time.',
          price:        p.salePrice,
          comparePrice: p.origPrice,
          isOnSale:     true,
          salePercent:  5,
          saleLabel:    'Summer Sale',
          saleEndsAt:   SALE_ENDS,
          isFeatured:   true,
          isActive:     true,
          images:       p.images,
          tags:         ['summer-sale', 'featured'],
          stock:        50,
          categoryId:   'placeholder', // update with real categoryId from DB
        },
      })
      console.log(`✓ ${p.slug}`)
      console.log(`  A$${p.origPrice} → A$${p.salePrice}  (Save A$${saving} · 5% off)\n`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      // Product might not exist yet — that's fine, images are ready
      console.log(`⚠ ${p.slug}: ${msg.split('\n')[0]}`)
    }
  }

  await prisma.$disconnect()
  console.log('✅ Summer sale update complete.')
  console.log(`   Sale ends: ${SALE_ENDS.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}`)
}

main().catch(console.error)
