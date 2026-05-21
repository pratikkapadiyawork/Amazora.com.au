'use client'

import { useState }          from 'react'
import Link                  from 'next/link'
import { motion }            from 'framer-motion'
import { ShoppingBag, Heart, Star, ChevronRight, Truck, Shield, RefreshCw } from 'lucide-react'
import { SmartImage }        from '@/components/shared/SmartImage'
import { PriceDisplay }      from '@/components/shared/PriceDisplay'
import { QtyInput }          from '@/components/shared/QtyInput'
import { useCartStore }      from '@/store/cartStore'
import { useWishlistStore }  from '@/store/wishlistStore'
import { avgRating }         from '@/lib/constants'
import type { ProductWithRelations } from '@/types'

interface Props {
  product: ProductWithRelations
}

export function ProductDetail({ product }: Props) {
  const [activeImg, setActiveImg]     = useState(0)
  const [qty, setQty]                 = useState(1)
  const [added, setAdded]             = useState(false)
  const [selectedVariant, setVariant] = useState<string | undefined>()

  const addItem  = useCartStore(s => s.addItem)
  const toggle   = useWishlistStore(s => s.toggle)
  const wished   = useWishlistStore(s => s.hasItem(product.id))
  const rating   = avgRating(product.reviews)
  const onSale   = !!product.comparePrice && Number(product.comparePrice) > Number(product.price)
  const imgs     = product.images.length > 0 ? product.images : ['']

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name:      product.name,
      slug:      product.slug,
      image:     imgs[0] ?? '',
      price:     Number(product.price),
      variant:   selectedVariant,
      maxStock:  product.stock,
      qty,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-brand-red transition-colors">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/category/${product.category.slug}`} className="hover:text-brand-red transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-brand-navy font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-3">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-card"
          >
            <SmartImage
              src={imgs[activeImg] ?? ''}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              fallbackGradient="from-brand-navy to-brand-steel"
            />
            {onSale && (
              <div className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">
                Sale
              </div>
            )}
          </motion.div>

          {imgs.length > 1 && (
            <div className="flex gap-2">
              {imgs.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === activeImg ? 'border-brand-red' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <SmartImage
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    fallbackGradient="from-brand-navy to-brand-steel"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-brand-teal text-xs font-bold uppercase tracking-widest mb-2">
            {product.category.name}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-navy mb-3 leading-tight">
            {product.name}
          </h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm text-brand-muted">
                {rating.toFixed(1)} ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <div className="mb-6">
            <PriceDisplay
              price={Number(product.price)}
              comparePrice={product.comparePrice ? Number(product.comparePrice) : null}
              size="xl"
            />
          </div>

          {product.shortDesc && (
            <p className="text-brand-muted leading-relaxed mb-6">{product.shortDesc}</p>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-navy mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id === selectedVariant ? undefined : v.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      v.id === selectedVariant
                        ? 'bg-brand-navy text-white border-brand-navy'
                        : 'bg-white text-brand-navy border-gray-200 hover:border-brand-navy'
                    }`}
                  >
                    {v.name}
                    {v.price && <span className="ml-1 opacity-70">(+A${Number(v.price).toFixed(2)})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 mb-4">
            <QtyInput value={qty} onChange={setQty} min={1} max={product.stock || 99} />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-red text-white hover:bg-brand-red/90'
              }`}
            >
              <ShoppingBag size={17} />
              {added ? 'Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toggle({
                productId: product.id,
                name:      product.name,
                slug:      product.slug,
                image:     imgs[0] ?? '',
                price:     Number(product.price),
              })}
              aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                wished ? 'border-brand-red bg-brand-red/10' : 'border-gray-200 hover:border-brand-red'
              }`}
            >
              <Heart size={18} className={wished ? 'fill-brand-red text-brand-red' : 'text-brand-muted'} />
            </motion.button>
          </div>

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-amber-600 text-xs font-semibold mb-4">
              Only {product.stock} left in stock — order soon
            </p>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
            {[
              { icon: Truck,     label: 'Free shipping', sub: 'Orders over A$99'     },
              { icon: Shield,    label: 'Secure payment', sub: 'SSL encrypted'        },
              { icon: RefreshCw, label: 'Easy returns',  sub: '30-day hassle-free'    },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center">
                  <Icon size={16} className="text-brand-teal" />
                </div>
                <p className="text-[11px] font-semibold text-brand-navy">{label}</p>
                <p className="text-[10px] text-brand-muted">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full description */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-xl font-bold text-brand-navy mb-4">Product Details</h2>
        <div className="prose prose-sm text-brand-muted max-w-none leading-relaxed">
          {product.description.split('\n').map((para, i) => (
            <p key={i} className="mb-3">{para}</p>
          ))}
        </div>

        {product.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <Link
                key={tag}
                href={`/shop?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-brand-teal/10 text-brand-teal text-xs font-medium rounded-full hover:bg-brand-teal/20 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-brand-navy mb-6">
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="space-y-4">
            {product.reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-brand-navy text-sm">{review.name}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-brand-muted">
                    {new Date(review.createdAt).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.title && <p className="font-medium text-brand-navy text-sm mb-1">{review.title}</p>}
                <p className="text-brand-muted text-sm leading-relaxed">{review.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
