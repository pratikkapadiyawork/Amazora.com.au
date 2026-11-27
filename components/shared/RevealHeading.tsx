'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type ElementType, type ReactNode } from 'react'
import { animate, onScroll, splitText, stagger } from 'animejs'

/**
 * Heading split into characters with anime.js: letters rise out of a clipped line in a wave when the
 * heading enters the viewport, then the whole heading drifts gently against the scroll.
 */
export function RevealHeading({
  children, as = 'h2', className = '', delay = 0,
}: { children: string; as?: ElementType; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const split = splitText(el, { words: { wrap: 'clip' }, chars: true, accessible: true })
    const enter = animate(split.chars, {
      y: ['110%', '0%'], rotate: [8, 0], opacity: [0, 1],
      duration: 1000, delay: stagger(22, { start: delay * 1000 }), ease: 'outExpo',
      autoplay: onScroll({ target: el, enter: 'bottom top', repeat: false }),
    })
    const drift = animate(el, {
      y: [24, -24], ease: 'linear',
      autoplay: onScroll({ target: el, enter: 'bottom top', leave: 'top bottom', sync: true }),
    })
    return () => { enter.revert(); drift.revert(); split.revert() }
  }, [delay])

  return <Tag ref={ref} className={className}>{children}</Tag>
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}
