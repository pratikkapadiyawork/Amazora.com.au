import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateOrderNumber, SHIPPING } from '@/lib/constants'

interface CartLine {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  qty: number
  variant?: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, form, shipping, coupon, total } = body as {
      items: CartLine[]
      form?: Record<string, string>
      shipping: string
      coupon?: string
      total: number
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    if (!form?.email || !form?.firstName || !form?.lastName || !form?.address1 || !form?.city || !form?.state || !form?.postcode) {
      return NextResponse.json({ error: 'Please complete all delivery fields' }, { status: 400 })
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    let discount = 0

    if (coupon) {
      const c = await prisma.coupon.findUnique({ where: { code: coupon.toUpperCase() } })
      if (c?.isActive) {
        discount = c.type === 'PERCENTAGE'
          ? subtotal * (Number(c.value) / 100)
          : Number(c.value)
      }
    }

    const shipOpt = SHIPPING.find(s => s.id === shipping) ?? SHIPPING[0]
    const freeShip = subtotal - discount >= 99
    const shippingCost = freeShip && shipping === 'standard' ? 0 : shipOpt.price
    const orderTotal = Math.max(0, subtotal - discount + shippingCost)
    const tax = orderTotal * (0.10 / 1.10)

    if (Math.abs(orderTotal - total) > 0.05) {
      return NextResponse.json({ error: 'Order total mismatch — refresh and try again' }, { status: 400 })
    }

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
        shippingMethod: shipping,
        subtotal,
        shippingCost,
        discount,
        tax,
        total: orderTotal,
        couponCode: coupon ?? null,
        items: {
          create: items.map(item => ({
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

    const amountCents = Math.round(orderTotal * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'aud',
      receipt_email: form.email,
      metadata: {
        orderId:        order.id,
        orderNumber:    order.orderNumber,
        email:          form.email,
        name:           `${form.firstName} ${form.lastName}`.trim(),
        address:        JSON.stringify({
          address1: form.address1,
          address2: form.address2,
          city:     form.city,
          state:    form.state,
          postcode: form.postcode,
        }),
        shippingMethod: shipping,
        cart:           JSON.stringify(items.slice(0, 20)),
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
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    console.error('create-intent error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
