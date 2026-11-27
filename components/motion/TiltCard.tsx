'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { ReactNode } from 'react'

/** 3D tilt toward the pointer with a moving gold glare. Mouse only. */
export function TiltCard({ children, className = '', max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const px = useMotionValue(0.5), py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 })
  const gx = useTransform(px, v => `${v * 100}%`)
  const gy = useTransform(py, v => `${v * 100}%`)
  const glare = useMotionValue(0)
  const glareO = useSpring(glare, { stiffness: 200, damping: 25 })

  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width); py.set((e.clientY - r.top) / r.height); glare.set(1)
      }}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); glare.set(0) }}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] mix-blend-soft-light z-20"
        style={{
          opacity: glareO,
          background: useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,236,180,0.55), transparent 55%)`),
        }}
      />
    </motion.div>
  )
}
