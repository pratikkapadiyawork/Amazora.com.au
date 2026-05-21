'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

export function ClearCartOnSuccess() {
  const params = useSearchParams()
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    if (params.get('paid') === '1') clearCart()
  }, [params, clearCart])

  return null
}
