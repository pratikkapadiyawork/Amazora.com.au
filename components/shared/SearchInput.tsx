'use client'

import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'

interface Props {
  value:        string
  onChange:     (v: string) => void
  onClear?:     () => void
  placeholder?: string
  className?:   string
  autoFocus?:   boolean
  variant?:     'light' | 'dark'
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search chess sets, leather goods, gifts...',
  className   = '',
  autoFocus   = false,
  variant     = 'light',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
    onClear?.()
    inputRef.current?.focus()
  }

  const inputClass =
    variant === 'dark'
      ? 'glass-dark border border-white/20 text-white placeholder:text-white/35 focus:border-brand-red/50 focus:shadow-glow-rose'
      : 'bg-white border border-brand-red/20 text-brand-navy placeholder:text-brand-muted/40 focus:border-brand-red/50 focus:shadow-glow-rose'

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={18}
        className={`absolute left-4 pointer-events-none transition-colors duration-200 ${
          value ? 'text-brand-red' : variant === 'dark' ? 'text-white/40' : 'text-brand-muted/50'
        }`}
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        aria-label="Search products"
        className={`w-full h-13 pl-11 pr-11 rounded-2xl text-sm font-medium outline-none transition-all duration-250 ${inputClass}`}
      />

      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={`absolute right-4 p-1 rounded-full transition-colors ${
              variant === 'dark'
                ? 'text-white/40 hover:text-white hover:bg-white/10'
                : 'text-brand-muted/50 hover:text-brand-red hover:bg-brand-red/10'
            }`}
          >
            <X size={15} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
