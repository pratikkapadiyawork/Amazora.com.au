'use client'

import { motion } from 'framer-motion'
import { PAYMENT_METHODS } from '@/lib/constants'

interface Props {
  className?:    string
  variant?:      'light' | 'dark' | 'minimal'
  showLabel?:    boolean
  showSecurity?: boolean
  size?:         'sm' | 'md'
}

export function PaymentBadges({
  className    = '',
  variant      = 'light',
  showLabel    = true,
  showSecurity = true,
  size         = 'md',
}: Props) {
  const h = size === 'sm' ? 'h-5 px-2 text-[9px]' : 'h-[1.625rem] px-2.5 text-[10.5px]'

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <p className={`font-semibold uppercase tracking-widest text-[10px] ${
          variant === 'dark' ? 'text-white/40' : 'text-brand-muted/50'
        }`}>
          Secure checkout · All payments accepted
        </p>
      )}

      <div className="payment-strip">
        {PAYMENT_METHODS.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            title={method.label}
            className={`payment-badge ${h} font-bold`}
            style={{
              background: variant === 'dark' ? 'rgba(255,255,255,0.10)' : method.bg,
              color:       variant === 'dark' ? '#fff' : method.text,
              borderColor: variant === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
            }}
          >
            {method.abbr}
          </motion.div>
        ))}
      </div>

      {showSecurity && (
        <p className={`flex items-center gap-1.5 text-[11px] ${
          variant === 'dark' ? 'text-white/35' : 'text-brand-muted/50'
        }`}>
          <svg width="11" height="13" viewBox="0 0 11 13" fill="currentColor" aria-hidden="true">
            <path d="M5.5 0L0 2v4c0 3.31 2.34 6.41 5.5 7 3.16-.59 5.5-3.69 5.5-7V2L5.5 0zm0 6h4.5c-.24 2.41-1.97 4.55-4.5 5.17V6H1V3.12L5.5 1.5 10 3.12V6H5.5z" />
          </svg>
          256-bit SSL · Australian business · 30-day returns
        </p>
      )}
    </div>
  )
}
