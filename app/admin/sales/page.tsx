import { prisma }      from '@/lib/db'
import { SaleManager } from '@/components/admin/SaleManager'
import { Zap }         from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSalesPage() {
  const products = await prisma.product.findMany({
    where:   { isActive: true },
    orderBy: [{ isOnSale: 'desc' }, { name: 'asc' }],
    select: {
      id:          true,
      slug:        true,
      name:        true,
      price:       true,
      comparePrice:true,
      images:      true,
      isOnSale:    true,
      salePercent: true,
      saleLabel:   true,
      saleEndsAt:  true,
      isActive:    true,
    },
  })

  const serialised = products.map(p => ({
    ...p,
    price:        Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    saleEndsAt:   p.saleEndsAt ? p.saleEndsAt.toISOString() : null,
  }))

  const onSaleCount = serialised.filter(p => p.isOnSale).length

  return (
    <div className="min-h-screen bg-brand-teal py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-red flex items-center justify-center">
              <Zap size={20} className="fill-white text-white" />
            </div>
            <div>
              <h1 className="font-display text-brand-navy text-2xl font-bold">Sale Manager</h1>
              <p className="text-brand-muted text-sm">
                Toggle sales on/off and set discounts — no code deploy needed.
              </p>
            </div>
          </div>
          {onSaleCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20">
              <Zap size={13} className="fill-brand-red text-brand-red" />
              <span className="text-brand-red text-xs font-bold">
                {onSaleCount} product{onSaleCount !== 1 ? 's' : ''} currently on sale
              </span>
            </div>
          )}
        </div>

        <SaleManager products={serialised} />

        {/* Help text */}
        <div className="mt-8 p-4 rounded-2xl bg-brand-navy/8 border border-brand-steel/15">
          <p className="text-brand-muted text-xs leading-relaxed">
            <strong className="text-brand-navy">How it works:</strong>{' '}
            Toggle &ldquo;Start Sale&rdquo; to mark a product as on-sale. Set the discount % and an optional end date.
            The SummerSaleShowcase on the homepage will automatically show sale products from the database
            when 4 or more active sale products exist. The hardcoded fallback is always shown otherwise.
          </p>
        </div>
      </div>
    </div>
  )
}
