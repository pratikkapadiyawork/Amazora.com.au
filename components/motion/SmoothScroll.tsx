'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/** Buttery inertial scrolling (Lenis). Off for reduced motion and touch devices. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -110 } })
    let raf = 0
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    // pause while the cart / search overlays lock the page
    const mo = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-cart-open') || document.body.style.overflow === 'hidden') lenis.stop()
      else lenis.start()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-cart-open'] })
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    return () => { cancelAnimationFrame(raf); mo.disconnect(); lenis.destroy() }
  }, [])
  return null
}
