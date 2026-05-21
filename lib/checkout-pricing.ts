import { prisma } from '@/lib/db'
import { SHIPPING } from '@/lib/constants'
import type { Product, Variant } from '@prisma/client'

export interface CartLineInput {
  productId: string
  qty: number
  variant?: string
}

export interface ValidatedLine {
  productId: string
  name: string
  slug: string
  image: string
  price: number
  qty: number
  variant?: string
}

export interface PricedOrder {
  lines: ValidatedLine[]
  subtotal: number
  discount: number
  shippingCost: number
  tax: number
  total: number
  couponCode: string | null
}

function unitPrice(product: Product, variants: Variant[], variantName?: string): number {
  if (variantName) {
    const v = variants.find(x => x.name === variantName)
    if (v?.price != null) return Number(v.price)
  }
  return Number(product.price)
}

function availableStock(product: Product, variants: Variant[], variantName?: string): number {
  if (variantName) {
    const v = variants.find(x => x.name === variantName)
    if (v) return v.stock
  }
  return product.stock
}

export async function priceCartFromDatabase(
  items: CartLineInput[],
  shippingId: string,
  couponCode?: string | null,
): Promise<{ ok: true; order: PricedOrder } | { ok: false; error: string }> {
  if (!items?.length) {
    return { ok: false, error: 'Cart is empty' }
  }

  const productIds = [...new Set(items.map(i => i.productId))]
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { variants: true },
  })

  const byId = new Map(products.map(p => [p.id, p]))
  const lines: ValidatedLine[] = []

  for (const item of items) {
    const product = byId.get(item.productId)
    if (!product) {
      return { ok: false, error: 'A product in your cart is no longer available.' }
    }

    const qty = Math.max(1, Math.min(Math.floor(item.qty), 99))
    const stock = availableStock(product, product.variants, item.variant)
    if (stock < qty) {
      return { ok: false, error: `${product.name} only has ${stock} in stock.` }
    }

    const price = unitPrice(product, product.variants, item.variant)
    const image = product.images[0] ?? ''

    lines.push({
      productId: product.id,
      name:      product.name,
      slug:      product.slug,
      image,
      price,
      qty,
      variant: item.variant,
    })
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  let discount = 0
  let appliedCoupon: string | null = null

  if (couponCode?.trim()) {
    const c = await prisma.coupon.findUnique({
      where: { code: couponCode.trim().toUpperCase() },
    })
    if (!c || !c.isActive) {
      return { ok: false, error: 'Invalid coupon code' }
    }
    if (c.expiresAt && c.expiresAt < new Date()) {
      return { ok: false, error: 'This coupon has expired' }
    }
    if (c.maxUses != null && c.usedCount >= c.maxUses) {
      return { ok: false, error: 'This coupon has reached its usage limit' }
    }
    const minOrder = c.minOrder ? Number(c.minOrder) : null
    if (minOrder != null && subtotal < minOrder) {
      return { ok: false, error: `Minimum order of A$${minOrder.toFixed(2)} required for this coupon` }
    }
    discount =
      c.type === 'PERCENTAGE'
        ? Math.round(subtotal * (Number(c.value) / 100) * 100) / 100
        : Math.min(Number(c.value), subtotal)
    appliedCoupon = c.code
  }

  const shipOpt = SHIPPING.find(s => s.id === shippingId) ?? SHIPPING[0]
  const freeShip = subtotal - discount >= 99
  const shippingCost = freeShip && shippingId === 'standard' ? 0 : shipOpt.price
  const total = Math.max(0, subtotal - discount + shippingCost)
  const tax = total * (0.10 / 1.10)

  return {
    ok: true,
    order: {
      lines,
      subtotal,
      discount,
      shippingCost,
      tax,
      total,
      couponCode: appliedCoupon,
    },
  }
}
