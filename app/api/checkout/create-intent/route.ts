import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateOrderNumber } from '@/lib/constants'
import { priceCartFromDatabase } from '@/lib/checkout-pricing'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, form, shipping, coupon } = body as {
      items: { productId: string; qty: number; variant?: string }[]
      form?: Record<string, string>
      shipping: string
      coupon?: string
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!form?.email || !form?.firstName || !form?.lastName || !form?.address1 || !form?.city || !form?.state || !form?.postcode) {
      return NextResponse.json({ error: 'Please complete all delivery fields' }, { status: 400 })
    }

    const priced = await priceCartFromDatabase(items, shipping ?? 'standard', coupon)
    if (!priced.ok) {
      return NextResponse.json({ error: priced.error }, { status: 400 })
    }

    const { lines, subtotal, discount, shippingCost, tax, total, couponCode } = priced.order

    const order = await prisma.order.create({
      data: {
        orderNumber:   generateOrderNumber(),
        email:         form.email,
        status:        'PENDING',
        shippingName:  `${form.firstName} ${form.lastName}`.trim(),
        shippingPhone: form.phone ?? null,
        shippingAddr: {
          address1: form.address1,
          address2: form.address2 ?? '',
          city:     form.city,
          state:    form.state,
          postcode: form.postcode,
        },
        shippingMethod: shipping ?? 'standard',
        subtotal,
        shippingCost,
        discount,
        tax,
        total,
        couponCode,
        items: {
          create: lines.map(item => ({
            productId: item.productId,
            name:      item.name,
            image:     item.image,
            price:     item.price,
            qty:       item.qty,
            variant:   item.variant ?? null,
          })),
        },
      },
    })

    const amountCents = Math.round(total * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount:        amountCents,
      currency:      'aud',
      receipt_email: form.email,
      metadata: {
        orderId:        order.id,
        orderNumber:    order.orderNumber,
        email:          form.email,
        name:           `${form.firstName} ${form.lastName}`.trim(),
        shippingMethod: shipping ?? 'standard',
        subtotal:       String(subtotal),
        discount:       String(discount),
        shipping:       String(shippingCost),
        tax:            String(tax.toFixed(2)),
      },
      automatic_payment_methods: { enabled: true },
    })

    await prisma.order.update({
      where: { id: order.id },
      data:  { stripePaymentId: paymentIntent.id },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId:      order.id,
      total,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    console.error('create-intent error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
