import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/** pg treats sslmode=require as verify-full already; say so explicitly to silence its deprecation warning. */
export function normaliseDbUrl(url?: string) {
  return url?.replace(/sslmode=(prefer|require|verify-ca)\b/, 'sslmode=verify-full')
}

function makePrisma() {
  const pool    = new Pool({ connectionString: normaliseDbUrl(process.env.DATABASE_URL) })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? makePrisma()

// Cache across hot reloads in dev and across invocations in serverless production
globalForPrisma.prisma = prisma
