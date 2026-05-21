import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z }     from 'zod'
import { auth }  from '@clerk/nextjs/server'

const PatchSchema = z.object({
  id:          z.string(),
  isOnSale:    z.boolean().optional(),
  salePercent: z.number().int().min(1).max(99).optional().nullable(),
  saleLabel:   z.string().max(60).optional().nullable(),
  saleEndsAt:  z.string().datetime().optional().nullable(),
})

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', issues: parsed.error.issues }, { status: 400 })
  }

  const { id, ...data } = parsed.data

  const updateData: Record<string, unknown> = {}
  if (data.isOnSale    !== undefined) updateData.isOnSale    = data.isOnSale
  if (data.salePercent !== undefined) updateData.salePercent = data.salePercent
  if (data.saleLabel   !== undefined) updateData.saleLabel   = data.saleLabel
  if (data.saleEndsAt  !== undefined) {
    updateData.saleEndsAt = data.saleEndsAt ? new Date(data.saleEndsAt) : null
  }

  // Auto-recalculate price when toggling sale on/off
  if (data.isOnSale === true || data.isOnSale === false) {
    const product = await prisma.product.findUnique({
      where:  { id },
      select: { price: true, comparePrice: true, salePercent: true },
    })
    if (product) {
      const pct   = data.salePercent ?? product.salePercent ?? 5
      const base  = Number(product.comparePrice ?? product.price)
      if (data.isOnSale && pct) {
        updateData.price        = Number((base * (1 - pct / 100)).toFixed(2))
        updateData.comparePrice = base
      } else if (!data.isOnSale && product.comparePrice) {
        updateData.price        = Number(product.comparePrice)
        updateData.comparePrice = null
      }
    }
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data:  updateData,
      select: { id: true, slug: true, price: true, comparePrice: true, isOnSale: true },
    })
    return NextResponse.json({ ok: true, product: updated })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
