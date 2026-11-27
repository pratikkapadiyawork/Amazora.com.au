'use client'

import { Children, useEffect, useRef, type ReactNode } from 'react'
import { animate, stagger, onScroll, utils } from 'animejs'

/**
 * Product grid choreographed with anime.js:
 *  1. Entrance — cards rise and un-tilt in a staggered wave the first time the grid scrolls into view.
 *  2. Scroll-linked parallax — alternate columns drift against each other while the grid is on screen,
 *     so the products move with the page (and with the WebGL background behind them).
 * Uses transforms/opacity only; skipped entirely for reduced motion.
 */
export function AnimeGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = Array.from(el.querySelectorAll<HTMLElement>(':scope > .anime-item'))
    const pars = items.map(i => i.firstElementChild as HTMLElement)
    if (!items.length) return

    utils.set(items, { opacity: 0, translateY: 70, rotateX: 14, scale: 0.94 })
    const entrance = animate(items, {
      opacity: 1, translateY: 0, rotateX: 0, scale: 1,
      duration: 1100,
      ease: 'outExpo',
      delay: stagger(70),
      autoplay: onScroll({ target: el, enter: 'bottom-=8% top', repeat: false }),
    })

    // group cards by column (by their x position) and give columns opposite drift
    const narrow = window.innerWidth < 768
    const amp = narrow ? 14 : 34
    const lefts = [...new Set(items.map(i => Math.round(i.offsetLeft)))].sort((a, b) => a - b)
    const parallax = lefts.map((x, c) => {
      const col = pars.filter((_, k) => Math.round(items[k].offsetLeft) === x)
      const dir = c % 2 === 0 ? 1 : -1
      return animate(col, {
        translateY: [dir * amp, -dir * amp],
        ease: 'linear',
        autoplay: onScroll({ target: el, enter: 'bottom top', leave: 'top bottom', sync: 0.25 }),
      })
    })

    return () => {
      entrance.revert()
      parallax.forEach(a => a.revert())
    }
  }, [])

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      {Children.map(children, child => (
        <div className="anime-item will-change-transform">
          <div className="anime-par h-full">{child}</div>
        </div>
      ))}
    </div>
  )
}
