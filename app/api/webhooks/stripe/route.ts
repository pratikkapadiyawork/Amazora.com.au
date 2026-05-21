import { headers }      from 'next/headers'
import { NextResponse }  from 'next/server'
import Stripe            from 'stripe'
import { prisma }        from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(req: Request) {
  const body   = await req.text()
  const sig    = (await headers()).get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const orderId = pi.metadata?.orderId

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data:  {
            status:          'PROCESSING',
            stripePaymentId: pi.id,
            paymentMethod:   'stripe',
            paidAt:          new Date(),
          },
        })
      } catch (e) {
        console.error('Failed to update order from webhook:', e)
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed' && event.data.object) {
    const pi = event.data.object as Stripe.PaymentIntent
    const orderId = pi.metadata?.orderId
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'CANCELLED' },
      }).catch(() => null)
    }
  }

  return NextResponse.json({ received: true })
}
