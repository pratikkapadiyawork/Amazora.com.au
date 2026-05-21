import 'dotenv/config'
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient()

interface ProductRow {
  'Product Name':    string
  'Category':        string
  'Price':           number
  'Compare Price':   number
  'Description':     string
  'Short Desc':      string
  'SKU':             string
  'Stock':           number
  'Image File':      string
  'Image 2':         string
  'Image 3':         string
  'Featured':        string
  'Tags':            string
  'SEO Title':       string
  'SEO Description': string
  'Weight KG':       number
}

const CAT_SLUG_MAP: Record<string, string> = {
  'Marble Chess Sets':   'chess-sets',
  'Chess Sets':          'chess-sets',
  'Chess':               'chess-sets',
  'Premium Mugs':        'mugs',
  'Mugs':                'mugs',
  'Leather':             'leather',
  'Leather Accessories': 'leather',
  'Humidors':            'humidors',
  'Decorative Ships':    'ships',
  'Ships':               'ships',
  'Ceramic Decor':       'ceramic',
  'Ceramic':             'ceramic',
  'Hip Flasks':          'hip-flasks',
  'Flasks':              'hip-flasks',
  'Gift Sets':           'gifts',
  'Premium Gift Sets':   'gifts',
  'Gifts':               'gifts',
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const searchPaths = [
    path.join(process.cwd(), 'scripts'),
    'E:\\projects\\pratik website\\new',
    process.cwd(),
  ]

  let excelPath: string | null = null
  const extensions = ['.xlsx', '.xls', '.csv']

  for (const dir of searchPaths) {
    if (!fs.existsSync(dir)) continue
    for (const ext of extensions) {
      const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(ext))
      if (files.length > 0) {
        excelPath = path.join(dir, files[0])
        console.log(`✓ Found pricing file: ${excelPath}`)
        break
      }
    }
    if (excelPath) break
  }

  if (!excelPath) {
    console.error('❌ No Excel/CSV file found. Copy your pricing file to: scripts/')
    process.exit(1)
  }

  const workbook  = XLSX.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const sheet     = workbook.Sheets[sheetName]
  const rows      = XLSX.utils.sheet_to_json<ProductRow>(sheet, { defval: '' })

  console.log(`\n📊 Found ${rows.length} products in "${sheetName}"`)
  if (rows[0]) {
    console.log('   Columns:', Object.keys(rows[0]).join(', '))
  }

  const categoryCache: Record<string, string> = {}
  const CATEGORY_DATA = [
    { slug: 'chess-sets', name: 'Marble Chess Sets',  sortOrder: 1, image: '/images/cat-chess-sets.jpg'  },
    { slug: 'mugs',       name: 'Premium Mugs',        sortOrder: 2, image: '/images/cat-mugs.jpg'        },
    { slug: 'leather',    name: 'Leather Accessories', sortOrder: 3, image: '/images/cat-leather.jpg'     },
    { slug: 'humidors',   name: 'Humidors',            sortOrder: 4, image: '/images/cat-humidors.jpg'    },
    { slug: 'ships',      name: 'Decorative Ships',    sortOrder: 5, image: '/images/cat-ships.jpg'       },
    { slug: 'ceramic',    name: 'Ceramic Decor',       sortOrder: 6, image: '/images/cat-ceramic.jpg'     },
    { slug: 'hip-flasks', name: 'Hip Flasks',          sortOrder: 7, image: '/images/cat-hip-flasks.jpg'  },
    { slug: 'gifts',      name: 'Premium Gift Sets',   sortOrder: 8, image: '/images/cat-gifts.jpg'       },
  ]

  for (const cat of CATEGORY_DATA) {
    const result = await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder, image: cat.image },
      create: { ...cat },
    })
    categoryCache[cat.slug] = result.id
    categoryCache[cat.name] = result.id
  }

  let imported = 0
  let skipped  = 0
  const errors: string[] = []

  for (const row of rows) {
    const name = String(row['Product Name'] || '').trim()
    if (!name) { skipped++; continue }

    const rawCat  = String(row['Category'] || 'Gifts').trim()
    const catSlug = CAT_SLUG_MAP[rawCat] ?? slugify(rawCat)
    const catId   = categoryCache[catSlug] ?? categoryCache['gifts']

    if (!catId) {
      errors.push(`⚠ No category for: ${rawCat} (${name})`)
      skipped++
      continue
    }

    const slug  = slugify(name)

    // Excel price = actual sale price; compare price = marked-up "was" price
    // 18% markup creates ~15% discount appearance (rounds to nearest $0.05)
    const MARKUP = 1.18
    const price        = parseFloat(String(row['Price'] || '0'))
    const excelCompare = row['Compare Price'] ? parseFloat(String(row['Compare Price'])) : null
    const comparePrice = excelCompare
      ?? Math.ceil(price * MARKUP * 20) / 20   // auto markup if no explicit compare price

    if (!price || price <= 0) {
      errors.push(`⚠ Invalid price for: ${name}`)
      skipped++
      continue
    }

    const images: string[] = []
    for (const field of ['Image File', 'Image 2', 'Image 3'] as const) {
      const filename = String(row[field as keyof ProductRow] || '').trim()
      if (filename && filename !== '0') {
        const fname = filename.includes('.') ? filename : `${filename}.jpg`
        images.push(`/products/${fname}`)
      }
    }

    if (images.length === 0) {
      const imgDir = path.join(process.cwd(), 'public', 'products')
      if (fs.existsSync(imgDir)) {
        const prefix  = slug.substring(0, 10).replace(/-/g, '').toLowerCase()
        const matched = fs.readdirSync(imgDir).filter(f => f.toLowerCase().includes(prefix))
        if (matched.length > 0) images.push(`/products/${matched[0]}`)
      }
    }

    if (images.length === 0) images.push('/images/product-placeholder.jpg')

    try {
      await prisma.product.upsert({
        where:  { slug },
        update: {
          price,
          comparePrice,
          stock:        parseInt(String(row['Stock'] || '50')),
          isActive:     true,
          images,
        },
        create: {
          slug,
          name,
          shortDesc:    String(row['Short Desc']   || '').trim() || null,
          description:  String(row['Description']  || name).trim(),
          price,
          comparePrice,
          sku:          String(row['SKU']     || '').trim() || null,
          images,
          categoryId:   catId,
          stock:        parseInt(String(row['Stock']     || '50')),
          weight:       row['Weight KG'] ? parseFloat(String(row['Weight KG'])) : null,
          isFeatured:   String(row['Featured']).toLowerCase() === 'yes',
          isActive:     true,
          tags:         String(row['Tags'] || '').split(',').map(t => t.trim()).filter(Boolean),
          seoTitle:     String(row['SEO Title']       || '').trim() || null,
          seoDesc:      String(row['SEO Description'] || '').trim() || null,
        },
      })
      console.log(`  ✓ [${++imported}] ${name} — A$${price.toFixed(2)} (was A$${comparePrice.toFixed(2)})`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push(`❌ Failed: ${name} — ${message}`)
      skipped++
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`✅ Import complete`)
  console.log(`   Imported: ${imported}`)
  console.log(`   Skipped:  ${skipped}`)
  if (errors.length) {
    console.log('\n⚠ Warnings/Errors:')
    errors.forEach(e => console.log('  ' + e))
  }
  console.log('═'.repeat(50))

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
