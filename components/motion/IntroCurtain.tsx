'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/** One short branded intro per browser session: the emblem draws itself, then the curtain parts. */
export function IntroCurtain() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('amz-intro')) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      sessionStorage.setItem('amz-intro', '1')
    } catch { return }
    setShow(true)
    const t = setTimeout(() => setShow(false), 1700)
    return () => clearTimeout(t)
  }, [])

  const oct = Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + 45 * i) * Math.PI) / 180
    return `${50 + 44 * Math.cos(a)},${50 + 44 * Math.sin(a)}`
  }).join(' ')

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" className="fixed inset-0 z-[1000] pointer-events-none" exit={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-[#070606]" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#070606]" exit={{ y: '100%' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} />
          <motion.div className="absolute inset-0 grid place-items-center" exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col items-center gap-6">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <defs>
                  <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FBE7A1" /><stop offset=".5" stopColor="#D9A93F" /><stop offset="1" stopColor="#F3D27A" />
                  </linearGradient>
                </defs>
                <motion.polygon points={oct} fill="none" stroke="url(#ig)" strokeWidth="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeInOut' }} />
                <motion.path d="M24 80 L47 17 L54 17 L36 80 Z M53 28 L59 17 L80 80 L68 80 Z M35 60 L51 52 L66 60 L64 66 L51 59 L38 66 Z"
                  fill="url(#ig)" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6 }} />
              </svg>
              <motion.div className="h-px w-48 bg-gradient-to-r from-transparent via-[#F3D27A] to-transparent"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 1.1, ease: [0.19, 1, 0.22, 1] }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
