'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface Props {
  amount:     number
  onAnimate?: () => void
  isLoading?: boolean
}

export function PaymentAnimation({ amount, onAnimate, isLoading }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative w-full max-w-[340px] h-24 rounded-2xl overflow-hidden cursor-pointer select-none"
      onHoverStart={() => { setHovered(true); onAnimate?.() }}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Card side */}
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center justify-center rounded-xl"
        style={{ background: 'linear-gradient(135deg, #5de2a3, #3bbf82)' }}
        animate={{ width: hovered ? '100%' : '100px' }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="w-14 h-9 bg-[#c7ffbc] rounded-lg shadow-[4px_4px_8px_rgba(77,200,143,0.5)] flex flex-col items-center pt-1.5"
          animate={hovered ? { y: -40, rotate: 90 } : { y: 0, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="w-11 h-2.5 bg-[#80ea69] rounded-sm" />
          <div className="w-2 h-2 rounded-full bg-[#379e1f] mt-1 shadow-[0_-8px_0_0_#26850e,0_8px_0_0_#56be3e]" />
        </motion.div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: -10, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute bottom-0 w-12 h-14 bg-[#dddde0] rounded-lg overflow-hidden flex flex-col items-center"
            >
              <div className="w-10 h-2 bg-[#545354] mt-1.5 rounded-sm" />
              <div className="w-10 h-5 bg-white mt-0.5 rounded-sm flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#4b953b]">A${amount.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Text side */}
      <div className="absolute inset-y-0 right-0 left-[100px] bg-white flex items-center justify-between px-5">
        <span className="font-semibold text-brand-navy text-base">
          {isLoading ? 'Processing...' : 'Secure Payment'}
        </span>
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ repeat: hovered ? Infinity : 0, repeatType: 'reverse', duration: 0.5 }}
        >
          <svg width="20" height="20" viewBox="0 0 452 452" fill="#9F6496" aria-hidden="true">
            <path d="M345.4 248.3L151.2 442.6c-12.4 12.4-32.4 12.4-44.8 0-12.4-12.4-12.4-32.4 0-44.8L278.3 225.9 106.4 54c-12.4-12.4-12.4-32.4 0-44.8 12.4-12.4 32.4-12.4 44.8 0l194.3 194.3c6.2 6.2 9.3 14.3 9.3 22.4 0 8.1-3.1 16.2-9.3 22.4z" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
