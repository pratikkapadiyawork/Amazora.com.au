'use client'

import {
  motion,
  AnimatePresence,
} from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Heart, LayoutGrid } from 'lucide-react'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { useCartStore }     from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUIStore }       from '@/store/uiStore'
import { NAV_LINKS }        from '@/lib/constants'
import { Logo }             from '@/components/shared/Logo'
import { BlackFridayBar }   from '@/components/layout/BlackFridayBar'

export function Navbar() {
  const pathname       = usePathname()
  const { isSignedIn } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [prevY,    setPrevY]    = useState(0)
  const [hidden,   setHidden]   = useState(false)

  const itemCount     = useCartStore(s => s.itemCount())
  const wishlistCount = useWishlistStore(s => s.count())
  const openCart      = useCartStore(s => s.openCart)
  const openSearch    = useUIStore(s => s.openSearch)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      if (y > 200) {
        setHidden(y > prevY && y > 300)
      } else {
        setHidden(false)
      }
      setPrevY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevY])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-brand-red focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <motion.header
        role="banner"
        className="fixed top-0 left-0 right-0 z-navbar"
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <BlackFridayBar />
        <div className="relative">
        {/* Animated glass background */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor:    scrolled ? 'rgba(11,10,9,0.86)' : 'rgba(11,10,9,0.55)',
            backdropFilter:     'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            borderBottom:       '1px solid rgba(217,169,63,0.16)',
            boxShadow:          scrolled ? '0 10px 40px rgba(0,0,0,0.45)' : 'none',
            transition:         'all 0.35s ease',
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Logo variant="compact" height={34} priority className="hover:opacity-90 transition-opacity" />

          {/* Desktop nav links */}
          <nav
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(link => {
              const isActive =
                pathname === (link.href as string) ||
                ((link.href as string) !== '/' && pathname.startsWith(link.href as string))
              return (
                <Link key={link.href} href={link.href as string}>
                  <motion.div
                    className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                    style={{ color: isActive ? '#F3D27A' : '#CDBE9C', letterSpacing: '0.04em' }}
                  >
                    {link.label}
                    {/* Active underline */}
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-red"
                      initial={false}
                      animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ originX: 0 }}
                    />
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-brand-red/[0.08]"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    />
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <NavIconButton
              onClick={openSearch}
              label="Search products"
              icon={<Search size={20} />}
            />

            <div className="hidden lg:block">
              <NavIconButton
                href="/account/wishlist"
                label={`Wishlist (${wishlistCount} items)`}
                icon={<Heart size={20} />}
                badge={wishlistCount}
              />
            </div>

            <div className="hidden lg:flex items-center justify-center min-w-10 h-10">
              {isSignedIn ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="whitespace-nowrap text-xs font-semibold text-brand-muted hover:text-brand-red px-3 py-1.5 rounded-lg hover:bg-brand-red/10 transition-all"
                  >
                    Sign in
                  </motion.button>
                </SignInButton>
              )}
            </div>

            <div className="lg:hidden">
              <NavIconButton
                href="/products"
                label="Browse all products"
                icon={<LayoutGrid size={20} />}
              />
            </div>

            <div className="hidden lg:block">
              <NavIconButton
                onClick={openCart}
                label={`Shopping cart (${itemCount} items)`}
                icon={<ShoppingBag size={20} />}
                badge={itemCount}
              />
            </div>
          </div>
        </div>
        </div>
      </motion.header>
    </>
  )
}

interface NavIconButtonProps {
  onClick?:    () => void
  href?:       string
  label:       string
  icon:        React.ReactNode
  badge?:      number
}

function NavIconButton({ onClick, href, label, icon, badge }: NavIconButtonProps) {
  const className =
    'relative w-10 h-10 rounded-xl flex items-center justify-center text-brand-muted hover:text-brand-red hover:bg-brand-red/10 transition-colors duration-150'

  const inner = (
    <>
      {icon}
      <AnimatePresence>
        {!!badge && badge > 0 && (
          <motion.span
            key={badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 15 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E11D2E] text-white text-[10px] font-bold flex items-center justify-center leading-none"
            aria-hidden="true"
          >
            {badge > 9 ? '9+' : badge}
          </motion.span>
        )}
      </AnimatePresence>
    </>
  )

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      {href ? (
        <Link href={href} aria-label={label} className={className}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} aria-label={label} className={className}>
          {inner}
        </button>
      )}
    </motion.div>
  )
}
