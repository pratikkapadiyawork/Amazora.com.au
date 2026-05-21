import type { Metadata }  from 'next'
import Link               from 'next/link'
import { Suspense }       from 'react'
import { prisma }         from '@/lib/db'
import { CheckCircle }    from 'lucide-react'
import { formatPrice }    from '@/lib/constants'
import { SmartImage }     from '@/components/shared/SmartImage'
import { ClearCartOnSuccess } from '@/components/checkout/ClearCartOnSuccess'

export const metadata: Metadata = {
  title:  'Order Confirmed | Amazora',
  robots: { index: false, follow: false },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params

  if (id === 'pending') {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center text-center px-4 gap-5">
        <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        <h1 className="text-2xl font-bold text-brand-navy">Processing your order…</h1>
        <p className="text-brand-muted">Please wait while we confirm your payment.</p>
      </div>
    )
  }

  const order = await prisma.order.findUnique({
    where:   { id },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, images: true, slug: true } },
        },
      },
    },
  }).catch(() => null)

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center text-center px-4 gap-5">
        <h1 className="text-2xl font-bold text-brand-navy">Order not found</h1>
        <Link href="/shop" className="px-6 py-3 bg-brand-red text-white rounded-xl font-semibold">
          Back to Shop
        </Link>
      </div>
    )
  }

  const addr = order.shippingAddr as Record<string, string>

  return (
    <div className="min-h-screen bg-brand-cream py-12 px-4">
      <Suspense fallback={null}>
        <ClearCartOnSuccess />
      </Suspense>
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-1">Order Confirmed!</h1>
          <p className="text-brand-muted">
            Order <span className="font-semibold text-brand-navy">{order.orderNumber}</span> has been placed.
          </p>
          <p className="text-sm text-brand-muted mt-1">
            A confirmation email will be sent to {order.email}
          </p>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-brand-navy mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-brand-cream">
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                    fallbackGradient="from-brand-navy to-brand-steel"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-brand-navy text-sm">{item.name}</p>
                  {item.variant && <p className="text-xs text-brand-muted">{item.variant}</p>}
                  <p className="text-xs text-brand-muted">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-brand-navy text-sm">
                  {formatPrice(Number(item.price) * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−{formatPrice(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-muted">
              <span>Shipping</span>
              <span>{Number(order.shippingCost) === 0 ? 'Free' : formatPrice(Number(order.shippingCost))}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-navy pt-1 border-t border-gray-100">
              <span>Total</span><span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-brand-navy mb-3">Shipping To</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            {order.shippingName}<br />
            {addr.address1}{addr.address2 && `, ${addr.address2}`}<br />
            {addr.city} {addr.state} {addr.postcode}<br />
            Australia
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/shop"
            className="flex-1 py-3 border-2 border-brand-navy text-brand-navy rounded-xl font-semibold text-center hover:bg-brand-navy hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 bg-brand-red text-white rounded-xl font-semibold text-center hover:bg-brand-red/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
