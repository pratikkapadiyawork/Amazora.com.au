'use client'

import Link               from 'next/link'
import { motion }         from 'framer-motion'
import { useState }       from 'react'
import { Heart, Plus, Check, Star } from 'lucide-react'
import { useCartStore }    from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { avgRating }       from '@/lib/constants'
import { SmartImage }      from '@/components/shared/SmartImage'
import type { ProductCard as T }  from '@/types'
import { TiltCard }        from '@/components/motion/TiltCard'

export function ProductCard({ product, priority = false }: { product: T; priority?: boolean }) {
  const [added, setAdded] = useState(false)

  const addItem = useCartStore(s => s.addItem)
  const toggle  = useWishlistStore(s => s.toggle)
  const wished  = useWishlistStore(s => s.hasItem(product.id))

  const rating  = avgRating(product.reviews)
  const price   = Number(product.price)
  const compare = product.comparePrice ? Number(product.comparePrice) : null
  const onSale  = !!compare && compare > price
  const pct     = onSale ? Math.round((1 - price / compare!) * 100) : 0
  const alt     = product.images[1]

  const payload = {
    productId: product.id,
    name:      product.name,
    slug:      product.slug,
    image:     product.images[0] ?? '/images/product-placeholder.jpg',
    price,
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    addItem(payload)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    toggle(payload)
  }

  return (
    <TiltCard className="h-full">
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="h-full group relative rounded-[18px] p-[1px] bg-[linear-gradient(160deg,rgba(243,210,122,0.35),rgba(243,210,122,0.04)_40%,rgba(243,210,122,0.18))] hover:bg-[linear-gradient(160deg,rgba(243,210,122,0.9),rgba(184,134,43,0.25)_45%,rgba(243,210,122,0.7))] transition-[background] duration-500"
    >
      <div className="relative h-full rounded-[17px] overflow-hidden bg-[rgba(18,16,14,0.42)] backdrop-blur-md">
        {/* Image stage */}
        <Link href={`/shop/${product.slug}`} className="block" aria-label={product.name}>
          <div className="relative aspect-[4/5] overflow-hidden product-img-container">
            <SmartImage
              src={product.images[0] ?? ''}
              alt={product.name}
              fill
              priority={priority}
              className={`object-cover transition-all duration-700 ${alt ? 'group-hover:opacity-0' : ''}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
            />
            {alt && (
              <SmartImage
                src={alt}
                alt=""
                fill
                className="object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

            {onSale && (
              <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                <span className="bg-[#E11D2E] text-white text-xs font-bold px-2 py-1 rounded-sm shadow-lg">
                  −{pct}%
                </span>
              </div>
            )}

            {/* Quick add — desktop hover */}
            <div className="absolute inset-x-3 bottom-3 hidden md:block opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleAdd}
                className={`w-full h-10 rounded-full text-sm font-semibold transition-colors ${
                  added ? 'bg-emerald-500 text-white' : 'bg-[rgba(11,10,9,0.4)]/90 text-[#F3D27A] hover:bg-[#F3D27A] hover:text-[#0B0A09] backdrop-blur'
                }`}
              >
                {added ? 'Added to bag' : 'Quick add'}
              </button>
            </div>
          </div>
        </Link>

        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={handleWish}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/55 backdrop-blur flex items-center justify-center z-10 hover:bg-black/80 transition-colors"
        >
          <Heart size={15} className={wished ? 'fill-[#E11D2E] text-[#E11D2E]' : 'text-white'} />
        </motion.button>

        {/* Info */}
        <div className="p-4 pb-5">
          <p className="text-[#A99F8C] text-xs mb-1 truncate">
            {product.category.name}
          </p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-sans font-semibold text-[15px] text-[#F4ECDC] leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-[#F3D27A] transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={10} className={s <= Math.round(rating) ? 'fill-[#F3D27A] text-[#F3D27A]' : 'fill-white/10 text-white/10'} />
              ))}
              <span className="text-[10px] text-[#A99F8C]">({product.reviews.length})</span>
            </div>
          )}

          <div className="flex items-end justify-between mt-3">
            <div className="leading-none">
              <span className="text-[#F3D27A] font-bold text-lg tabular-nums">A${price.toFixed(2)}</span>
              {onSale && (
                <span className="block text-[11px] text-[#A99F8C] line-through mt-1 tabular-nums">A${compare!.toFixed(2)}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                added ? 'bg-emerald-500 text-white' : 'bg-[linear-gradient(135deg,#FBE7A1,#D9A93F_55%,#B8862B)] text-[#0B0A09] hover:shadow-[0_0_24px_rgba(243,210,122,0.45)]'
              }`}
            >
              {added ? <Check size={16} /> : <Plus size={17} strokeWidth={2.5} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
    </TiltCard>
  )
}
