'use client'

import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

interface Props {
  value:     number
  min?:      number
  max?:      number
  onChange:  (value: number) => void
  size?:     'xs' | 'sm' | 'md' | 'lg'
  variant?:  'default' | 'dark' | 'glass'
  disabled?: boolean
}

const SIZE = {
  xs: { btn: 'w-7 h-7',    input: 'w-9 h-7 text-xs',    icon: 12 },
  sm: { btn: 'w-8 h-8',    input: 'w-10 h-8 text-sm',   icon: 13 },
  md: { btn: 'w-10 h-10',  input: 'w-12 h-10 text-base',icon: 15 },
  lg: { btn: 'w-12 h-12',  input: 'w-16 h-12 text-lg',  icon: 17 },
}

const VARIANT_STYLES = {
  default: {
    wrap:  'bg-brand-cream border border-brand-red/20',
    btn:   'bg-white hover:bg-brand-red/10 text-brand-muted hover:text-brand-red',
    input: 'bg-transparent text-brand-navy',
    div:   'border-brand-red/15',
  },
  dark: {
    wrap:  'glass-dark border border-white/15',
    btn:   'hover:bg-white/10 text-white/70 hover:text-white',
    input: 'bg-transparent text-white',
    div:   'border-white/10',
  },
  glass: {
    wrap:  'glass border border-white/20',
    btn:   'hover:bg-brand-red/15 text-brand-muted hover:text-brand-red',
    input: 'bg-transparent text-brand-navy',
    div:   'border-white/15',
  },
}

export function QtyInput({
  value,
  min      = 1,
  max      = 99,
  onChange,
  size     = 'md',
  variant  = 'default',
  disabled = false,
}: Props) {
  const s = SIZE[size]
  const v = VARIANT_STYLES[variant]

  const decrement = () => { if (value > min) onChange(value - 1) }
  const increment = () => { if (value < max) onChange(value + 1) }

  return (
    <div
      className={`inline-flex items-center rounded-xl overflow-hidden ${v.wrap} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
      role="group"
      aria-label="Quantity"
    >
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        onClick={decrement}
        disabled={value <= min || disabled}
        aria-label="Decrease quantity"
        className={`${s.btn} flex items-center justify-center ${v.btn} transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-r ${v.div} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50`}
      >
        <Minus size={s.icon} strokeWidth={2.5} />
      </motion.button>

      <input
        type="number"
        value={value}
        min={min}
        max={max}
        readOnly
        aria-label={`Quantity: ${value}`}
        className={`${s.input} ${v.input} text-center font-semibold border-0 outline-none cursor-default [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none select-none`}
      />

      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        onClick={increment}
        disabled={value >= max || disabled}
        aria-label="Increase quantity"
        className={`${s.btn} flex items-center justify-center ${v.btn} transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-l ${v.div} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50`}
      >
        <Plus size={s.icon} strokeWidth={2.5} />
      </motion.button>
    </div>
  )
}
