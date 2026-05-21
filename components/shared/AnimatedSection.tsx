'use client'

import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, useEffect, type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const VARIANTS: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 32  }, visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -32 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 32  }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  none:  { hidden: { opacity: 0         }, visible: { opacity: 1       } },
}

interface Props {
  children:   ReactNode
  className?: string
  direction?: Direction
  delay?:     number
  duration?:  number
  once?:      boolean
  margin?:    string
  as?:        'div' | 'section' | 'article' | 'header' | 'footer' | 'li'
}

export function AnimatedSection({
  children,
  className,
  direction = 'up',
  delay     = 0,
  duration  = 0.6,
  once      = true,
  margin    = '-80px',
  as        = 'div',
}: Props) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: margin as `${number}px` })

  const MotionComponent = motion[as] as typeof motion.div

  return (
    <MotionComponent
      ref={ref}
      className={className}
      variants={VARIANTS[direction]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </MotionComponent>
  )
}

export const StaggerContainer = motion.div

export const staggerContainerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const staggerItemVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.23, 1, 0.32, 1] } },
}

export function useAnimatedCounter(target: number, duration = 1.5) {
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    let rafId: number
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed  = (now - startTime) / (duration * 1000)
      const progress = Math.min(elapsed, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      if (ref.current) {
        ref.current.textContent = Math.round(eased * target).toLocaleString('en-AU')
      }
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(rafId) }
  }, [inView, target, duration])

  return ref
}
