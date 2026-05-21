'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore }     from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore }       from '@/store/uiStore'

const TABS = [
  { id: 'home',     label: 'Home',    href: '/'                 as string | null, icon: Home,        action: null as string | null },
  { id: 'search',   label: 'Search',  href: null,               icon: Search,      action: 'search'  },
  { id: 'cart',     label: 'Cart',    href: null,               icon: ShoppingBag, action: 'cart'    },
  { id: 'wishlist', label: 'Saved',   href: '/saved',            icon: Heart,       action: null      },
  { id: 'account',  label: 'Account', href: '/account',         icon: User,        action: null      },
]

export function NavbarMobile() {
  const pathname      = usePathname()
  const cartCount     = useCartStore(s => s.itemCount())
  const wishlistCount = useWishlistStore(s => s.count())
  const openCart      = useCartStore(s => s.openCart)
  const openSearch    = useUIStore(s => s.openSearch)

  const badges: Record<string, number> = {
    cart:     cartCount,
    wishlist: wishlistCount,
  }

  const handleAction = (action: string | null) => {
    if (action === 'cart')   openCart()
    if (action === 'search') openSearch()
  }

  const isActive = (tab: typeof TABS[number]) => {
    if (!tab.href) return false
    if (tab.href === '/') return pathname === '/'
    return pathname.startsWith(tab.href)
  }

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-navbar lg:hidden"
    >
      <div style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="mx-3 mb-3">
          <div className="glass-premium rounded-[22px] overflow-hidden shadow-glass-premium">
            <div className="flex items-stretch h-[64px]">
              {TABS.map(tab => {
                const active  = isActive(tab)
                const badge   = badges[tab.id] ?? 0
                const Icon    = tab.icon

                const content = (
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer select-none"
                  >
                    {/* Active dot indicator */}
                    <AnimatePresence>
                      {active && (
                        <motion.div
                          layoutId="mobile-nav-dot"
                          className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-red"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon with badge */}
                    <div className="relative">
                      <motion.div
                        animate={{ color: active ? '#D391B0' : 'rgba(211,145,176,0.5)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                      </motion.div>
                      {badge > 0 && (
                        <motion.span
                          key={badge}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center"
                          aria-hidden="true"
                        >
                          {badge > 9 ? '9+' : badge}
                        </motion.span>
                      )}
                    </div>

                    {/* Label */}
                    <motion.span
                      animate={{
                        color:      active ? '#D391B0' : 'rgba(211,145,176,0.45)',
                        fontWeight: active ? 600 : 400,
                      }}
                      className="text-[9.5px]"
                    >
                      {tab.label}
                    </motion.span>
                  </motion.div>
                )

                return tab.href ? (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className="flex-1 flex items-stretch"
                    aria-label={`${tab.label}${badge ? ` (${badge})` : ''}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleAction(tab.action)}
                    className="flex-1 flex items-stretch"
                    aria-label={`${tab.label}${badge ? ` (${badge})` : ''}`}
                  >
                    {content}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
