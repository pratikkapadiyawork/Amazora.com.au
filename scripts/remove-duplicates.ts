import path from 'path'
import { config } from 'dotenv'
config({ path: path.join(process.cwd(), '.env.local'), override: true })

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) } as never)

const TO_DEACTIVATE = [
  'barrel-mug-18th', 'barrel-mug-30th', 'barrel-mug-40th',
  'leather-belt-b3', 'leather-belt-b4',
  'cigar-case-steel-2', 'cigar-cutter-cc2',
]

async function main() {
  let done = 0
  for (const slug of TO_DEACTIVATE) {
    try {
      await prisma.product.update({ where: { slug }, data: { isActive: false } })
      console.log(`✓ Deactivated: ${slug}`)
      done++
    } catch { console.log(`  Skip: ${slug}`) }
  }
  console.log(`\n✅ Done: ${done}`)
  await prisma.$disconnect()
  await pool.end()
}
main().catch(console.error)
