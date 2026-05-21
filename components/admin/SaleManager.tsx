'use client'
import { useState, useTransition } from 'react'
import { Zap, Check, X, Loader2, Tag } from 'lucide-react'
import Image from 'next/image'

interface SaleProduct {
  id:          string
  slug:        string
  name:        string
  price:       number
  comparePrice: number | null
  images:      string[]
  isOnSale:    boolean
  salePercent: number | null
  saleLabel:   string | null
  saleEndsAt:  string | null
  isActive:    boolean
}

interface SaleManagerProps {
  products: SaleProduct[]
}

// Optimistic row for toggling sale status
function ProductSaleRow({
  product,
  onToggle,
  onUpdate,
}: {
  product: SaleProduct
  onToggle: (id: string, isOnSale: boolean) => void
  onUpdate: (id: string, data: Partial<SaleProduct>) => void
}) {
  const [open, setOpen] = useState(false)
  const [pct,  setPct]  = useState(product.salePercent ?? 5)
  const [label, setLabel] = useState(product.saleLabel ?? 'Summer Sale')
  const [ends, setEnds]   = useState(
    product.saleEndsAt ? new Date(product.saleEndsAt).toISOString().split('T')[0] : ''
  )

  const salePrice = product.isOnSale && pct
    ? Number((Number(product.comparePrice ?? product.price) * (1 - pct / 100)).toFixed(2))
    : product.price

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      product.isOnSale
        ? 'border-brand-red/30 bg-brand-red/5'
        : 'border-brand-steel/20 bg-brand-cream/50'
    }`}>
      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-teal/20 flex-shrink-0">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-brand-muted/30">
              <Tag size={20} />
            </div>
          )}
        </div>

        {/* Name + prices */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-navy text-sm truncate">{product.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {product.isOnSale ? (
              <>
                <span className="text-brand-red font-bold text-sm">A${salePrice.toFixed(2)}</span>
                <span className="text-brand-muted/50 line-through text-xs">
                  A${(product.comparePrice ?? product.price).toFixed(2)}
                </span>
                <span className="text-green-600 text-[10px] font-bold">
                  {pct}% off
                </span>
              </>
            ) : (
              <span className="text-brand-navy font-semibold text-sm">A${product.price.toFixed(2)}</span>
            )}
          </div>
          {product.isOnSale && product.saleLabel && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-red/80 mt-0.5">
              <Zap size={9} className="fill-brand-red/70" />
              {product.saleLabel}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setOpen(o => !o)}
            className="text-xs px-3 py-1.5 rounded-xl border border-brand-steel/25 text-brand-muted hover:border-brand-steel/50 hover:text-brand-navy transition-colors"
          >
            {open ? 'Close' : 'Edit'}
          </button>
          <button
            onClick={() => onToggle(product.id, !product.isOnSale)}
            className={`
              flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all duration-200
              ${product.isOnSale
                ? 'bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white border border-brand-red/25'
                : 'bg-brand-navy text-brand-cream hover:bg-brand-navy-light border border-brand-navy/25'
              }
            `}
          >
            {product.isOnSale ? (
              <><X size={12} /> End Sale</>
            ) : (
              <><Zap size={12} /> Start Sale</>
            )}
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="px-4 pb-4 border-t border-brand-steel/15 pt-4 bg-white/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1.5">
                Discount %
              </label>
              <input
                type="number" min={1} max={99} value={pct}
                onChange={e => setPct(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-xl border border-brand-steel/25 text-brand-navy text-sm bg-brand-cream focus:border-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1.5">
                Sale Label
              </label>
              <input
                type="text" value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g. Summer Sale"
                className="w-full h-9 px-3 rounded-xl border border-brand-steel/25 text-brand-navy text-sm bg-brand-cream focus:border-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1.5">
                Sale Ends
              </label>
              <input
                type="date" value={ends}
                onChange={e => setEnds(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-brand-steel/25 text-brand-navy text-sm bg-brand-cream focus:border-brand-red outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  onUpdate(product.id, {
                    salePercent: pct,
                    saleLabel:   label,
                    saleEndsAt:  ends ? new Date(ends).toISOString() : null,
                  })
                  setOpen(false)
                }}
                className="w-full h-9 rounded-xl bg-brand-navy text-brand-cream text-xs font-bold hover:bg-brand-navy-light transition-colors flex items-center justify-center gap-1.5"
              >
                <Check size={13} /> Save
              </button>
            </div>
          </div>
          {pct > 0 && (
            <p className="text-xs text-brand-muted/70 mt-3">
              Preview: A${(Number(product.comparePrice ?? product.price) * (1 - pct / 100)).toFixed(2)}{' '}
              <span className="line-through">A${(product.comparePrice ?? product.price).toFixed(2)}</span>{' '}
              · Save A${(Number(product.comparePrice ?? product.price) * pct / 100).toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function SaleManager({ products: initialProducts }: SaleManagerProps) {
  const [products, setProducts] = useState(initialProducts)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState<string[]>([])

  const onSaleCount = products.filter(p => p.isOnSale).length

  const handleToggle = (id: string, isOnSale: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isOnSale } : p))
    startTransition(async () => {
      const res = await fetch('/api/admin/sale', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, isOnSale }),
      })
      if (!res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, isOnSale: !isOnSale } : p))
      } else {
        setSaved(s => [...s, id])
        setTimeout(() => setSaved(s => s.filter(i => i !== id)), 2000)
      }
    })
  }

  const handleUpdate = (id: string, data: Partial<SaleProduct>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    startTransition(async () => {
      const res = await fetch('/api/admin/sale', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, ...data }),
      })
      if (res.ok) {
        setSaved(s => [...s, id])
        setTimeout(() => setSaved(s => s.filter(i => i !== id)), 2000)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-brand-cream rounded-2xl p-4 shadow-card">
          <p className="text-brand-muted text-xs font-bold uppercase tracking-wider mb-1">Active Sales</p>
          <p className="text-brand-red font-bold text-2xl">{onSaleCount}</p>
        </div>
        <div className="bg-brand-cream rounded-2xl p-4 shadow-card">
          <p className="text-brand-muted text-xs font-bold uppercase tracking-wider mb-1">Total Products</p>
          <p className="text-brand-navy font-bold text-2xl">{products.length}</p>
        </div>
        <div className="bg-brand-cream rounded-2xl p-4 shadow-card flex items-center gap-3">
          {isPending ? (
            <><Loader2 size={18} className="animate-spin text-brand-muted" /><span className="text-brand-muted text-sm">Saving…</span></>
          ) : (
            <><Check size={18} className="text-green-600" /><span className="text-brand-muted text-sm">All saved</span></>
          )}
        </div>
      </div>

      {/* Product rows */}
      <div className="space-y-3">
        {products.map(prod => (
          <div key={prod.id} className="relative">
            <ProductSaleRow
              product={prod}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
            />
            {saved.includes(prod.id) && (
              <div className="absolute top-4 right-4 text-green-500 text-xs font-bold flex items-center gap-1 pointer-events-none animate-fade-in">
                <Check size={12} /> Saved
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-brand-muted/50">
          <Tag size={32} className="mx-auto mb-3 opacity-30" />
          <p>No products found.</p>
        </div>
      )}
    </div>
  )
}
