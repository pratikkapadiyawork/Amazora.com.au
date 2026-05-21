'use client'

import Link               from 'next/link'
import { motion }         from 'framer-motion'
import { useState }       from 'react'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useCartStore }    from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { avgRating }       from '@/lib/constants'
import { SmartImage }      from '@/components/shared/SmartImage'
import { PriceDisplay }    from '@/components/shared/PriceDisplay'
import type { ProductCard as T }  from '@/types'

export function ProductCard({ product }: { product: T }) {
  const [added, setAdded] = useState(false)

  const addItem = useCartStore(s => s.addItem)
  const toggle  = useWishlistStore(s => s.toggle)
  const wished  = useWishlistStore(s => s.hasItem(product.id))

  const rating = avgRating(product.reviews)
  const onSale = !!product.comparePrice && Number(product.comparePrice) > Number(product.price)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name:      product.name,
      slug:      product.slug,
      image:     product.images[0] ?? '/images/product-placeholder.jpg',
      price:     Number(product.price),
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle({
      productId: product.id,
      name:      product.name,
      slug:      product.slug,
      image:     product.images[0] ?? '/images/product-placeholder.jpg',
      price:     Number(product.price),
    })
  }

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500"
    >
      {/* Product image */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-cream product-img-container">
          <SmartImage
            src={product.images[0] ?? ''}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 320px"
            fallbackGradient="from-brand-navy to-brand-steel"
          />
          {onSale && (
            <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Sale
            </div>
          )}
          {/* Quick add overlay — shows on hover */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleAdd}
              className={`w-full h-9 rounded-xl font-semibold text-xs transition-all duration-200 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-brand-navy/85 backdrop-blur-sm text-white hover:bg-brand-red'
              }`}
            >
              {added ? '✓ Added!' : '+ Quick Add'}
            </motion.button>
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <motion.button
        whileTap={{ scale: 0.82 }}
        onClick={handleWish}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-cream/95 backdrop-blur-sm shadow-sm flex items-center justify-center z-10 hover:bg-brand-red/10 transition-colors"
      >
        <Heart
          size={15}
          className={`transition-colors ${wished ? 'fill-brand-red text-brand-red' : 'text-brand-muted/70'}`}
        />
      </motion.button>

      {/* Product info */}
      <div className="p-4">
        <p className="text-brand-muted/55 text-[10px] font-bold uppercase tracking-widest mb-1">
          {product.category.name}
        </p>

        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-semibold text-brand-navy text-sm leading-snug hover:text-brand-red transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {product.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={11}
                  className={
                    s <= Math.round(rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-200 text-gray-200'
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-brand-muted/45">({product.reviews.length})</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <PriceDisplay
            price={Number(product.price)}
            comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
            size="md"
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white'
            }`}
          >
            <ShoppingBag size={15} />
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}
