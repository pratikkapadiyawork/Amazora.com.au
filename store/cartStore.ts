import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'

export interface CartItem {
  id:        string  // `${productId}-${variant ?? 'default'}`
  productId: string
  name:      string
  slug:      string
  image:     string
  price:     number
  qty:       number
  variant?:  string
  maxStock?: number
}

interface CartState {
  items:        CartItem[]
  isOpen:       boolean
  coupon:       { code: string; discount: number; type: 'pct' | 'fixed' } | null
  addItem:      (item: Omit<CartItem, 'id' | 'qty'> & { qty?: number }) => void
  removeItem:   (id: string) => void
  updateQty:    (id: string, qty: number) => void
  clearCart:    () => void
  openCart:     () => void
  closeCart:    () => void
  toggleCart:   () => void
  setCoupon:    (coupon: CartState['coupon']) => void
  removeCoupon: () => void
  subtotal:     () => number
  discount:     () => number
  shipping:     () => number
  gst:          () => number
  total:        () => number
  itemCount:    () => number
}

const FREE_SHIPPING_THRESHOLD = 99
const SHIPPING_COST           = 9.99
const GST_RATE                = 0.10

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,
      coupon: null,

      addItem: ({ qty = 1, ...item }: Omit<CartItem, 'id' | 'qty'> & { qty?: number }) => {
        const id = `${item.productId}-${item.variant ?? 'default'}`
        set(state => {
          const exists = state.items.find(i => i.id === id)
          if (exists) {
            const newQty = Math.min(exists.qty + qty, item.maxStock ?? 99)
            toast.success(`Updated: ${item.name}`, { description: `Qty: ${newQty}` })
            return {
              items:  state.items.map(i => i.id === id ? { ...i, qty: newQty } : i),
              isOpen: true,
            }
          }
          toast.success('Added to cart', { description: item.name })
          return {
            items:  [...state.items, { ...item, id, qty }],
            isOpen: true,
          }
        })
      },

      removeItem: (id) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }))
        toast.info('Item removed')
      },

      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set(state => ({
          items: state.items.map(i => i.id === id ? { ...i, qty } : i),
        }))
      },

      clearCart:    () => set({ items: [], coupon: null }),
      openCart:     () => set({ isOpen: true  }),
      closeCart:    () => set({ isOpen: false }),
      toggleCart:   () => set(s => ({ isOpen: !s.isOpen })),
      setCoupon:    (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),

      discount: () => {
        const { coupon, subtotal } = get()
        if (!coupon) return 0
        return coupon.type === 'pct'
          ? subtotal() * (coupon.discount / 100)
          : Math.min(coupon.discount, subtotal())
      },

      shipping: () => {
        const { subtotal, discount } = get()
        return subtotal() - discount() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
      },

      gst: () => {
        const { subtotal, discount, shipping } = get()
        const taxable = subtotal() - discount() + shipping()
        return taxable * (GST_RATE / (1 + GST_RATE))
      },

      total: () => {
        const { subtotal, discount, shipping } = get()
        return subtotal() - discount() + shipping()
      },

      itemCount: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    {
      name:    'amazora-cart-v2',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
)
