'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { SmartImage } from '@/components/shared/SmartImage'
import { formatPrice } from '@/lib/constants'

export default function SavedPage() {
  const items = useWishlistStore(s => s.items)
  const remove = useWishlistStore(s => s.remove)
  const addToCart = useCartStore(s => s.addItem)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-5 bg-brand-cream">
        <div className="w-16 h-16 rounded-2xl bg-brand-red/10 flex items-center justify-center">
          <Heart size={28} className="text-brand-red/60" />
        </div>
        <h1 className="font-display text-2xl text-brand-navy">Nothing saved yet</h1>
        <p className="text-brand-muted text-sm max-w-xs">Tap the heart on any product to save it here.</p>
        <Link href="/shop" className="h-11 px-7 rounded-xl bg-brand-red text-white font-semibold text-sm">
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl text-brand-navy mb-1">Saved Items</h1>
        <p className="text-brand-muted text-sm mb-6">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <div className="space-y-3">
          {items.map(item => (
            <motion.div
              key={item.productId}
              layout
              className="bg-white rounded-2xl p-4 flex gap-4 shadow-card"
            >
              <Link href={`/shop/${item.slug}`} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-brand-cream">
                <SmartImage src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.slug}`} className="font-semibold text-brand-navy text-sm hover:text-brand-red line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-brand-red font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => addToCart({
                      productId: item.productId,
                      name: item.name,
                      slug: item.slug,
                      image: item.image,
                      price: item.price,
                    })}
                    className="h-9 px-4 rounded-lg bg-brand-red text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <ShoppingBag size={14} /> Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="h-9 px-3 rounded-lg border border-gray-200 text-brand-muted text-xs hover:border-brand-red hover:text-brand-red"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
