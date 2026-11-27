'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: x, transformOrigin: '0 50%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[999] bg-[linear-gradient(90deg,#B8862B,#FBE7A1,#E11D2E)] pointer-events-none"
    />
  )
}
