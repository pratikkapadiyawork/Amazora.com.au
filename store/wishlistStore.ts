import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from 'sonner'

interface WishlistItem {
  productId: string
  name:      string
  slug:      string
  image:     string
  price:     number
  addedAt:   number
}

interface WishlistState {
  items:   WishlistItem[]
  hasItem: (productId: string) => boolean
  toggle:  (item: Omit<WishlistItem, 'addedAt'>) => void
  remove:  (productId: string) => void
  clear:   () => void
  count:   () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      hasItem: (productId) => get().items.some(i => i.productId === productId),

      toggle: (item) => {
        if (get().hasItem(item.productId)) {
          get().remove(item.productId)
        } else {
          set(s => ({ items: [...s.items, { ...item, addedAt: Date.now() }] }))
          toast.success('Saved to wishlist', { description: item.name })
        }
      },

      remove: (productId) => {
        set(s => ({ items: s.items.filter(i => i.productId !== productId) }))
        toast.info('Removed from wishlist')
      },

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name:    'amazora-wishlist-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
