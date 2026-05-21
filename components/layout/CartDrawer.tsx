'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Trash2, Tag, ChevronRight, Truck, ShoppingBag } from 'lucide-react'
import { useCartStore }      from '@/store/cartStore'
import { useEffect, useState } from 'react'
import { QtyInput }          from '@/components/shared/QtyInput'
import { PaymentBadges }     from '@/components/shared/PaymentBadges'
import { formatPrice }       from '@/lib/constants'
import { toast }             from 'sonner'

const FREE_SHIPPING_THRESHOLD = 99

export function CartDrawer() {
  const {
    items, isOpen, closeCart, removeItem, updateQty,
    subtotal, discount, shipping, gst, total, itemCount,
    coupon, setCoupon, removeCoupon,
  } = useCartStore()

  const sub      = subtotal()
  const disc     = discount()
  const ship     = shipping()
  const tot      = total()
  const count    = itemCount()
  const progress = Math.min((sub / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - sub, 0)

  // Lock body scroll when open; dim main content behind drawer
  useEffect(() => {
    const root = document.documentElement
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      root.setAttribute('data-cart-open', 'true')
    } else {
      document.body.style.overflow = ''
      root.removeAttribute('data-cart-open')
    }
    return () => {
      document.body.style.overflow = ''
      root.removeAttribute('data-cart-open')
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  const [couponInput,   setCouponInput]   = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const applyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const res  = await fetch('/api/coupons/validate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: couponInput.trim(), subtotal: sub }),
      })
      const data = await res.json()
      if (data.valid) {
        setCoupon({ code: couponInput.trim(), discount: data.discount, type: data.type })
        toast.success(`Coupon applied! You save ${formatPrice(data.discount)}`)
        setCouponInput('')
      } else {
        toast.error(data.message ?? 'Invalid coupon code')
      }
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-drawer bg-brand-navy/70 backdrop-blur-md"
            style={{ zIndex: 250 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
            className="fixed inset-y-0 right-0 z-drawer w-full max-w-[440px] flex flex-col overflow-hidden shadow-[-24px_0_80px_rgba(0,0,0,0.5)] isolate"
            style={{ zIndex: 251, background: '#1d3557' }}
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-lg text-white font-semibold">Your Cart</h2>
                {count > 0 && (
                  <span className="bg-brand-red/20 text-brand-red text-xs font-bold px-2 py-0.5 rounded-full">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={closeCart}
                aria-label="Close cart"
                className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Free shipping bar */}
            {sub > 0 && (
              <div className="flex-none px-5 py-3 border-b border-white/[0.08]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Truck size={13} className="text-brand-red" />
                    {remaining > 0 ? (
                      <span className="text-white/60">
                        Add{' '}
                        <span className="text-brand-red font-semibold">{formatPrice(remaining)}</span>
                        {' '}for free shipping
                      </span>
                    ) : (
                      <span className="text-green-400 font-semibold">✓ Free shipping unlocked!</span>
                    )}
                  </div>
                  <span className="text-white/40 text-xs">{formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-steel"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-2 scrollbar-hide">
              {items.length === 0 ? (
                <EmptyCart onClose={closeCart} />
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-4 py-4 border-b border-white/[0.08]">
                        {/* Image */}
                        <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-brand-cream">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={closeCart}
                            className="font-medium text-white text-sm hover:text-brand-red transition-colors line-clamp-2 leading-tight"
                          >
                            {item.name}
                          </Link>
                          {item.variant && (
                            <p className="text-white/40 text-xs mt-0.5">{item.variant}</p>
                          )}
                          <div className="flex items-center justify-between mt-3 gap-2">
                            <QtyInput
                              value={item.qty}
                              min={1}
                              max={item.maxStock ?? 99}
                              onChange={qty => updateQty(item.id, qty)}
                              size="xs"
                              variant="dark"
                            />
                            <p className="text-brand-red font-bold text-sm whitespace-nowrap">
                              {formatPrice(item.price * item.qty)}
                            </p>
                          </div>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-colors mt-0.5"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="flex-none px-5 py-4 space-y-3 border-t border-white/10 bg-black/20">
                {/* Coupon */}
                {!coupon ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                      />
                      <input
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                        placeholder="Coupon code"
                        className="w-full h-9 pl-8 pr-3 rounded-lg glass-dark border border-white/15 text-white/80 placeholder:text-white/25 text-xs outline-none focus:border-brand-red/40 transition-colors"
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponInput}
                      className="h-9 px-4 rounded-lg glass border border-white/20 text-white/70 text-xs font-semibold hover:border-brand-red/40 hover:text-brand-red disabled:opacity-40 transition-all"
                    >
                      {couponLoading ? '…' : 'Apply'}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-brand-red/15 rounded-lg px-3 py-2">
                    <span className="text-brand-red text-xs font-semibold">
                      ✓ {coupon.code} — {formatPrice(disc)} off
                    </span>
                    <button
                      onClick={removeCoupon}
                      aria-label="Remove coupon"
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                {/* Order summary */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(sub)}</span>
                  </div>
                  {disc > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>−{formatPrice(disc)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className={ship === 0 ? 'text-green-400 font-semibold' : ''}>
                      {ship === 0 ? 'FREE' : formatPrice(ship)}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/40 text-xs">
                    <span>GST (incl.)</span>
                    <span>{formatPrice(gst())}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-base pt-1.5 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-brand-red">{formatPrice(tot)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link href="/checkout" onClick={closeCart}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-13 rounded-2xl bg-brand-red text-white font-bold text-base shadow-cta hover:shadow-cta-hover transition-shadow duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Checkout — {formatPrice(tot)}
                    <ChevronRight size={18} />
                  </motion.div>
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-white/40 hover:text-white/60 text-sm transition-colors py-1"
                >
                  Continue shopping
                </button>

                <PaymentBadges variant="dark" showLabel={false} size="sm" />
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-2xl glass-card flex items-center justify-center mb-6"
      >
        <ShoppingBag size={32} className="text-brand-red/60" />
      </motion.div>
      <h3 className="font-display text-lg text-white mb-2">Your cart is empty</h3>
      <p className="text-white/50 text-sm mb-6 max-w-xs">
        Discover premium gifts and lifestyle products curated for Australians.
      </p>
      <Link href="/shop">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="h-11 px-7 rounded-xl bg-brand-red text-white font-semibold text-sm shadow-cta hover:shadow-cta-hover transition-shadow"
        >
          Shop Now →
        </motion.button>
      </Link>
    </div>
  )
}
