import type { CartItem } from '@/store/cartStore'
import type { PricedOrder } from '@/lib/checkout-pricing'

export function cartLinesForQuote(items: CartItem[]) {
  return items.map(i => ({
    productId: i.productId,
    qty:       i.qty,
    variant:   i.variant,
  }))
}

export async function fetchCheckoutQuote(
  items: CartItem[],
  shipping: string,
  coupon?: string | null,
): Promise<{ ok: true; order: PricedOrder } | { ok: false; error: string }> {
  const res = await fetch('/api/checkout/quote', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      items:    cartLinesForQuote(items),
      shipping,
      coupon:   coupon ?? undefined,
    }),
  })
  const data = await res.json()
  if (!res.ok) {
    return { ok: false, error: data.error ?? 'Could not load prices' }
  }
  return { ok: true, order: data as PricedOrder }
}
