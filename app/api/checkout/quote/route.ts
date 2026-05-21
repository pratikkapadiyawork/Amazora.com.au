import { NextResponse } from 'next/server'
import { priceCartFromDatabase } from '@/lib/checkout-pricing'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shipping, coupon } = body as {
      items: { productId: string; qty: number; variant?: string }[]
      shipping: string
      coupon?: string
    }

    const result = await priceCartFromDatabase(items ?? [], shipping ?? 'standard', coupon)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.order)
  } catch (err) {
    console.error('checkout quote error:', err)
    return NextResponse.json({ error: 'Could not calculate order total' }, { status: 500 })
  }
}
