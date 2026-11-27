/**
 * Catalog sync — runs before `next build` on Vercel production builds.
 *
 * Source of truth: lib/catalog-data.json (generated from the Google Drive "Product" folders).
 *  - Creates any catalog product that is not in the database yet (with the Black Friday price applied).
 *  - Re-activates catalog products; keeps existing prices so admin sale changes are never overwritten.
 *  - Hides (isActive = false) every product that is NOT in the catalog. Nothing is deleted,
 *    so past orders keep their product links.
 *
 * Safe by design: skips outside Vercel production (or with no DATABASE_URL) and never fails the build.
 * Force locally with: SYNC_CATALOG=1 npx tsx scripts/sync-catalog.ts
 */
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import catalog from '../lib/catalog-data.json'

/** Black Friday launch discount applied to newly created products. Change via /admin/sales afterwards. */
const BLACK_FRIDAY_PERCENT = 20
const BLACK_FRIDAY_ENDS    = new Date('2026-12-01T13:00:00Z') // end of Cyber Monday, Sydney time

const CATEGORIES: Record<string, { name: string; description: string; sortOrder: number }> = {
  'gifts':      { name: 'Unique Australian Gifts', description: 'Ned Kelly figurines, display guitars and grooming sets', sortOrder: 1 },
  'leather':    { name: 'Leather & Accessories',   description: 'Belts, cigar cases, cutters and car logo keychains',    sortOrder: 2 },
  'mugs':       { name: 'Premium Mugs',            description: 'Tankards and barrel mugs for every milestone',         sortOrder: 3 },
  'hip-flasks': { name: 'Hip Flasks',              description: 'Stainless steel flasks and birthday editions',         sortOrder: 4 },
  'ships':      { name: 'Ships, Planes & Models',  description: 'Model sailing ships and airline display planes',       sortOrder: 5 },
  'ceramic':    { name: 'Ceramic & Glass Decor',   description: 'Marble and crystal ashtrays, ceramic vases',           sortOrder: 6 },
  'chess-sets': { name: 'Marble Chess Sets',       description: 'Hand-cut 12" natural marble chess sets',               sortOrder: 7 },
  'humidors':   { name: 'Humidors',                description: 'Cedar-lined glass-top cigar humidors',                 sortOrder: 8 },
}

interface CatalogItem {
  slug: string; name: string; category: string; price: number; images: string[]
  shortDesc: string; description: string; tags: string[]; featured: boolean; sku: string; sort: number
}

function salePrice(list: number): number {
  return Number((Math.round(list * (1 - BLACK_FRIDAY_PERCENT / 100)) - 0.05).toFixed(2))
}

async function main() {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.SYNC_CATALOG === '1'
  if (!isProd || !process.env.DATABASE_URL) {
    console.log('[catalog] skipped (not a production build or no DATABASE_URL)')
    return
  }

  const pool   = new Pool({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
  const items  = catalog as CatalogItem[]

  try {
    const catIds: Record<string, string> = {}
    for (const [slug, c] of Object.entries(CATEGORIES)) {
      const row = await prisma.category.upsert({
        where:  { slug },
        update: { sortOrder: c.sortOrder },
        create: { slug, name: c.name, description: c.description, sortOrder: c.sortOrder },
      })
      catIds[slug] = row.id
    }

    let created = 0
    for (const p of items) {
      const exists = await prisma.product.findUnique({ where: { slug: p.slug }, select: { id: true } })
      if (exists) {
        await prisma.product.update({ where: { slug: p.slug }, data: { isActive: true, images: p.images } })
        continue
      }
      await prisma.product.create({
        data: {
          slug:         p.slug,
          name:         p.name,
          shortDesc:    p.shortDesc,
          description:  p.description,
          price:        salePrice(p.price),
          comparePrice: p.price,
          isOnSale:     true,
          salePercent:  BLACK_FRIDAY_PERCENT,
          saleLabel:    'Black Friday',
          saleEndsAt:   BLACK_FRIDAY_ENDS,
          sku:          p.sku,
          images:       p.images,
          categoryId:   catIds[p.category],
          stock:        25,
          isActive:     true,
          isFeatured:   p.featured,
          tags:         [...p.tags, 'black-friday'],
          seoTitle:     `${p.name} | Buy Online Australia — Amazora`,
          seoDesc:      p.shortDesc.slice(0, 155),
          // stagger createdAt so "New Arrivals" keeps the catalog order
          createdAt:    new Date(Date.UTC(2026, 10, 27, 0, 0, 0) - p.sort * 1000),
        },
      })
      created++
    }

    const hidden = await prisma.product.updateMany({
      where: { slug: { notIn: items.map(i => i.slug) }, isActive: true },
      data:  { isActive: false, isFeatured: false },
    })

    console.log(`[catalog] ${items.length} catalog products (${created} new), ${hidden.count} old products hidden`)
  } catch (err) {
    console.error('[catalog] sync failed — build continues with existing data:', err)
  } finally {
    await prisma.$disconnect().catch(() => {})
    await pool.end().catch(() => {})
  }
}

main()
