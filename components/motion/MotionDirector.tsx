'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { animate, onScroll, stagger, type JSAnimation } from 'animejs'

/**
 * Binds scroll-driven anime.js motion to every page after each navigation:
 *  • every section (except the first) rises and settles in 3D as it scrolls in, then eases back as it leaves
 *  • [data-anim-img]  — photos zoom out and drift inside their frames while passing
 *  • [data-float]     — gentle idle hover, staggered
 * Transforms only (no opacity on sections, so glass blur stays intact). Off for reduced motion.
 */
export function MotionDirector() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const narrow = window.innerWidth < 768
    const anims: JSAnimation[] = []
    let cancelled = false

    const bind = () => {
      if (cancelled) return
      const sections = Array.from(document.querySelectorAll<HTMLElement>('main section')).slice(1)
      sections.forEach(s => {
        s.style.transformOrigin = '50% 0%'
        anims.push(animate(s, {
          perspective: [1400, 1400],
          y: [narrow ? 40 : 90, 0],
          rotateX: [narrow ? 0 : 7, 0],
          scale: [0.965, 1],
          ease: 'outQuad',
          autoplay: onScroll({ target: s, enter: 'bottom top', leave: 'center top', sync: 0.4 }),
        }))
      })

      document.querySelectorAll<HTMLElement>('[data-anim-img]').forEach(img => {
        anims.push(animate(img, {
          scale: [1.16, 1.02],
          y: ['-5%', '5%'],
          ease: 'linear',
          autoplay: onScroll({ target: img.parentElement ?? img, enter: 'bottom top', leave: 'top bottom', sync: 0.3 }),
        }))
      })

      const floats = document.querySelectorAll<HTMLElement>('[data-float]')
      if (floats.length) {
        anims.push(animate(floats, {
          y: [-5, 5], duration: 2600, ease: 'inOutSine', loop: true, alternate: true,
          delay: stagger(140, { from: 'random' }),
        }))
      }
    }

    // let the new route paint first
    const id = window.setTimeout(() => requestAnimationFrame(bind), 60)
    return () => {
      cancelled = true
      window.clearTimeout(id)
      anims.forEach(a => a.revert())
    }
  }, [pathname])

  return null
}
