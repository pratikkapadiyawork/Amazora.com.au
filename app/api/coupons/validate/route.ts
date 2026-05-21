import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { priceCartFromDatabase } from '@/lib/checkout-pricing'

export async function POST(req: NextRequest) {
  const { code, items, shipping } = await req.json()

  if (!code) {
    return NextResponse.json({ valid: false, message: 'No coupon code provided' })
  }

  const priced = await priceCartFromDatabase(
    items ?? [],
    shipping ?? 'standard',
  )
  if (!priced.ok) {
    return NextResponse.json({ valid: false, message: priced.error })
  }

  const subtotal = priced.order.subtotal

  const coupon = await prisma.coupon.findUnique({
    where: { code: String(code).toUpperCase() },
  })

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, message: 'Invalid coupon code' })
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, message: 'This coupon has expired' })
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit' })
  }

  const minOrder = coupon.minOrder ? Number(coupon.minOrder) : null
  if (minOrder !== null && subtotal < minOrder) {
    return NextResponse.json({
      valid:   false,
      message: `Minimum order of A$${minOrder.toFixed(2)} required for this coupon`,
    })
  }

  const value    = Number(coupon.value)
  const discount =
    coupon.type === 'PERCENTAGE'
      ? subtotal * (value / 100)
      : Math.min(value, subtotal)

  return NextResponse.json({
    valid:    true,
    discount: Math.round(discount * 100) / 100,
    type:     coupon.type === 'PERCENTAGE' ? 'pct' : 'fixed',
  })
}
