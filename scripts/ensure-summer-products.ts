/**
 * Ensures summer-sale hero products exist in DB with correct slugs.
 * Run: npx tsx scripts/ensure-summer-products.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local', override: true })

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool   = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const ITEMS = [
  {
    slug: 'ned-kelly-1-gun-bronze',
    name: 'Ned Kelly — 1 Gun, Bronze Finish',
    price: 47.45,
    comparePrice: 49.95,
    cat: 'gifts',
    images: ['/products/ned-kelly-bronze-main.jpg'],
    tags: ['summer-sale', 'ned kelly', 'australian gift'],
  },
  {
    slug: 'miniature-guitar-acoustic',
    name: 'Miniature Guitar — Acoustic Display Replica',
    price: 28.45,
    comparePrice: 29.95,
    cat: 'gifts',
    images: ['/products/guitar-main.jpg'],
    tags: ['summer-sale', 'music gift'],
  },
  {
    slug: 'cigar-cutter-cc1',
    name: 'Cigar Cutter — Precision Guillotine',
    price: 14.20,
    comparePrice: 14.95,
    cat: 'leather',
    images: ['/products/cigar-cutter-main.jpg'],
    tags: ['summer-sale', 'cigar', 'cutter'],
  },
  {
    slug: 'marble-ashtray-m1',
    name: 'Marble Ashtray — Natural Stone Classic',
    price: 33.20,
    comparePrice: 34.95,
    cat: 'ceramic',
    images: ['/products/marble-ashtray-main.jpg'],
    tags: ['summer-sale', 'marble', 'ashtray'],
  },
]

async function main() {
  for (const item of ITEMS) {
    const category = await prisma.category.findUnique({ where: { slug: item.cat } })
    if (!category) {
      console.warn(`Skip ${item.slug}: category ${item.cat} missing`)
      continue
    }
    await prisma.product.upsert({
      where:  { slug: item.slug },
      update: {
        name: item.name,
        price: item.price,
        comparePrice: item.comparePrice,
        isOnSale: true,
        salePercent: 5,
        saleLabel: 'Summer Sale',
        isFeatured: true,
        isActive: true,
        images: item.images,
        tags: item.tags,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.name + '. Premium Australian gift from Amazora.',
        shortDesc: 'Premium gift — Summer Sale at Amazora Australia.',
        price: item.price,
        comparePrice: item.comparePrice,
        categoryId: category.id,
        isOnSale: true,
        salePercent: 5,
        saleLabel: 'Summer Sale',
        isFeatured: true,
        isActive: true,
        images: item.images,
        tags: item.tags,
        stock: 50,
        seoTitle: `${item.name} | Amazora Australia`,
        seoDesc: `Buy ${item.name} online at Amazora.com.au. Premium Australian gifts with fast delivery.`,
        seoKeywords: `amazora, ${item.name}, australia gift, amazora shop`,
      },
    })
    console.log(`✓ ${item.slug}`)
  }
  await prisma.$disconnect()
  await pool.end()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
