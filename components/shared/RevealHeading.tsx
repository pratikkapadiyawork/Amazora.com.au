'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

/** Heading whose words rise out of a mask when it scrolls into view. */
export function RevealHeading({
  children, as = 'h2', className = '', delay = 0,
}: { children: string; as?: ElementType; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  const Tag = as
  const words = children.split(' ')
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag className={className} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', rotate: 4 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.19, 1, 0.22, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  )
}
