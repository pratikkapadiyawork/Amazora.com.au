'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link                    from 'next/link'
import { motion }              from 'framer-motion'
import { ShoppingBag, Truck, CreditCard, ChevronRight, Tag, X } from 'lucide-react'
import { useCartStore }        from '@/store/cartStore'
import type { CartItem }       from '@/store/cartStore'
import { SHIPPING }           from '@/lib/constants'
import { AU_STATES }          from '@/types'
import type { CheckoutFormData } from '@/types'
import type { PricedOrder }    from '@/lib/checkout-pricing'
import { cartLinesForQuote, fetchCheckoutQuote } from '@/lib/checkout-quote-client'
import { SmartImage }          from '@/components/shared/SmartImage'
import { PriceDisplay }        from '@/components/shared/PriceDisplay'
import { StripePaymentForm }   from '@/components/checkout/StripePaymentForm'
import { toast }               from 'sonner'

const STEPS = ['Cart', 'Delivery', 'Payment'] as const
type Step = typeof STEPS[number]

function lineUnitPrice(quote: PricedOrder | null, item: CartItem): number {
  const line = quote?.lines.find(
    l =>
      l.productId === item.productId &&
      (l.variant ?? 'default') === (item.variant ?? 'default'),
  )
  return line?.price ?? item.price
}

export function CheckoutClient() {
  const { items, removeItem, updateQty, coupon, setCoupon, removeCoupon,
          itemCount, applyServerPrices } = useCartStore()

  const [step,         setStep]         = useState<Step>('Cart')
  const [form,         setForm]         = useState<CheckoutFormData>({})
  const [shippingId,   setShippingId]   = useState<string>('standard')
  const [couponInput,  setCouponInput]  = useState('')
  const [couponError,  setCouponError]  = useState('')
  const [processing,   setProcessing]   = useState(false)
  const [mounted,      setMounted]      = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId,      setOrderId]      = useState<string | null>(null)
  const [payError,     setPayError]     = useState('')
  const [quote,        setQuote]        = useState<PricedOrder | null>(null)
  const [quoteError,   setQuoteError]   = useState('')
  const [quoteLoading, setQuoteLoading] = useState(true)
  const [chargedTotal, setChargedTotal]   = useState<number | null>(null)
  const quoteFetchRef = useRef(0)

  const refreshQuote = useCallback(async () => {
    if (items.length === 0) {
      setQuote(null)
      setQuoteError('')
      setQuoteLoading(false)
      return
    }
    const fetchId = ++quoteFetchRef.current
    setQuoteLoading(true)
    const result = await fetchCheckoutQuote(items, shippingId, coupon?.code)
    if (fetchId !== quoteFetchRef.current) return
    setQuoteLoading(false)
    if (result.ok) {
      setQuote(result.order)
      setQuoteError('')
      applyServerPrices(result.order.lines)
    } else {
      setQuote(null)
      setQuoteError(result.error)
    }
  }, [items, shippingId, coupon?.code, applyServerPrices])

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const timer = setTimeout(() => {
      void refreshQuote()
    }, 300)
    return () => clearTimeout(timer)
  }, [mounted, refreshQuote])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (itemCount() === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center text-center px-4 gap-5">
        <ShoppingBag size={48} className="text-brand-muted/40" />
        <h1 className="text-2xl font-bold text-brand-navy">Your cart is empty</h1>
        <p className="text-brand-muted">Add something beautiful to get started.</p>
        <Link href="/shop" className="px-6 py-3 bg-brand-red text-white rounded-xl font-semibold">
          Shop Now
        </Link>
      </div>
    )
  }

  const sub        = quote?.subtotal ?? 0
  const disc       = quote?.discount ?? 0
  const shipCost   = quote?.shippingCost ?? 0
  const gstAmt     = quote?.tax ?? 0
  const orderTotal = chargedTotal ?? quote?.total ?? 0
  const freeShip   = shipCost === 0 && sub - disc >= 99

  const applyCoupon = async () => {
    if (!couponInput.trim()) return
    const res = await fetch('/api/coupons/validate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        code:     couponInput.trim(),
        items:    cartLinesForQuote(items),
        shipping: shippingId,
      }),
    })
    const data = await res.json()
    if (data.valid) {
      setCoupon({ code: couponInput.trim().toUpperCase(), discount: data.discount, type: data.type })
      setCouponInput('')
      setCouponError('')
    } else {
      setCouponError(data.message ?? data.error ?? 'Invalid coupon code')
    }
  }

  const preparePayment = async () => {
    setProcessing(true)
    setPayError('')
    try {
      const res = await fetch('/api/checkout/create-intent', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items:    cartLinesForQuote(items),
          form,
          shipping: shippingId,
          coupon:   coupon?.code,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not start payment')
      if (!data.clientSecret || !data.orderId) throw new Error('Invalid payment response')
      setClientSecret(data.clientSecret)
      setOrderId(data.orderId)
      setChargedTotal(typeof data.total === 'number' ? data.total : quote?.total ?? 0)
      setStep('Payment')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Checkout failed'
      setPayError(msg)
      toast.error(msg)
    } finally {
      setProcessing(false)
    }
  }

  const update = (field: keyof CheckoutFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => {
                  if (i < STEPS.indexOf(step)) setStep(s)
                }}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                  s === step
                    ? 'text-brand-red'
                    : i < STEPS.indexOf(step)
                      ? 'text-brand-navy hover:text-brand-red cursor-pointer'
                      : 'text-brand-muted/40 cursor-default'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  s === step ? 'bg-brand-red text-white' :
                  i < STEPS.indexOf(step) ? 'bg-brand-navy text-white' : 'bg-gray-200 text-gray-400'
                }`}>{i + 1}</span>
                {s}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main */}
          <div className="space-y-6">
            {/* STEP: Cart */}
            {step === 'Cart' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <ShoppingBag size={18} /> Cart ({itemCount()} items)
                </h2>
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 py-4 border-t border-gray-100">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-brand-cream">
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        fallbackGradient="from-brand-navy to-brand-steel"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-navy text-sm leading-snug">{item.name}</p>
                      {item.variant && <p className="text-xs text-brand-muted mt-0.5">{item.variant}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-7 h-7 text-brand-muted hover:text-brand-navy transition-colors"
                          >−</button>
                          <span className="w-7 text-center text-sm font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 text-brand-muted hover:text-brand-navy transition-colors"
                          >+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-brand-muted/60 hover:text-brand-red">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <PriceDisplay
                      price={lineUnitPrice(quote, item) * item.qty}
                      size="sm"
                    />
                  </div>
                ))}

                {/* Coupon */}
                {!coupon ? (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted/50" />
                        <input
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                          placeholder="Coupon code"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
                        />
                      </div>
                      <button onClick={applyCoupon} className="px-4 py-2.5 bg-brand-navy text-white rounded-xl text-sm font-semibold">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 border border-green-200 border-t">
                    <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
                      <Tag size={14} />
                      {coupon.code} applied — {coupon.type === 'pct' ? `${coupon.discount}% off` : `A$${coupon.discount} off`}
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('Delivery')}
                  className="w-full h-12 bg-brand-red text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  Continue to Delivery <ChevronRight size={16} />
                </motion.button>
              </div>
            )}

            {/* STEP: Delivery */}
            {step === 'Delivery' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <Truck size={18} /> Delivery Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'firstName' as const, label: 'First Name' },
                    { field: 'lastName'  as const, label: 'Last Name'  },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-brand-navy mb-1.5">{label}</label>
                      <input
                        value={form[field] ?? ''}
                        onChange={e => update(field, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  ))}
                </div>
                {[
                  { field: 'email'   as const, label: 'Email Address', type: 'email' },
                  { field: 'phone'   as const, label: 'Phone Number',  type: 'tel'   },
                  { field: 'address1' as const, label: 'Address Line 1' },
                  { field: 'address2' as const, label: 'Address Line 2 (optional)' },
                ].map(({ field, label, type = 'text' }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[field] ?? ''}
                      onChange={e => update(field, e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">City</label>
                    <input
                      value={form.city ?? ''}
                      onChange={e => update('city', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">Postcode</label>
                    <input
                      value={form.postcode ?? ''}
                      onChange={e => update('postcode', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1.5">State</label>
                  <select
                    value={form.state ?? ''}
                    onChange={e => update('state', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red bg-white"
                  >
                    <option value="">Select state</option>
                    {AU_STATES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Shipping method */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-brand-navy mb-3">Shipping Method</p>
                  <div className="space-y-2">
                    {SHIPPING.map(opt => {
                      const isFree = (quote?.subtotal ?? 0) - (quote?.discount ?? 0) >= 99 && opt.id === 'standard'
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                            shippingId === opt.id ? 'border-brand-red bg-brand-red/5' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={shippingId === opt.id}
                            onChange={() => setShippingId(opt.id)}
                            className="accent-brand-red"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold text-brand-navy">{opt.label}</p>
                              <p className="text-sm font-bold text-brand-red">
                                {isFree ? 'Free' : `A$${opt.price.toFixed(2)}`}
                              </p>
                            </div>
                            <p className="text-xs text-brand-muted">{opt.days} via {opt.carrier}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {payError && <p className="text-red-500 text-sm">{payError}</p>}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={preparePayment}
                  disabled={processing || quoteLoading || !!quoteError || !quote}
                  className="w-full h-12 bg-brand-red text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {processing ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Continue to Payment <ChevronRight size={16} /></>
                  )}
                </motion.button>
              </div>
            )}

            {/* STEP: Payment */}
            {step === 'Payment' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                  <CreditCard size={18} /> Secure Payment
                </h2>
                {clientSecret && orderId ? (
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    amount={orderTotal}
                  />
                ) : (
                  <p className="text-brand-muted text-sm">Preparing secure checkout…</p>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-brand-navy mb-4">Order Summary</h3>
              {quoteError && (
                <p className="text-red-600 text-xs mb-3">{quoteError}</p>
              )}
              {quoteLoading && (
                <p className="text-brand-muted text-xs mb-3">Updating prices…</p>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal ({itemCount()} items)</span>
                  <span className="font-medium">A${sub.toFixed(2)}</span>
                </div>
                {disc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>−A${disc.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-brand-muted">Shipping</span>
                  <span className={freeShip ? 'text-green-600 font-semibold' : 'font-medium'}>
                    {freeShip ? 'Free' : `A$${shipCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-muted">
                  <span>GST included</span>
                  <span>A${gstAmt.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-brand-navy">
                  <span>Total</span>
                  <span>A${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              {!freeShip && (
                <div className="mt-4 bg-brand-teal/10 rounded-xl p-3 text-xs text-brand-teal font-semibold">
                  Add A${(99 - (sub - disc)).toFixed(2)} more for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
