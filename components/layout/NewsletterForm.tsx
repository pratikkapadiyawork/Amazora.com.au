'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function NewsletterForm() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setDone(true)
      toast.success('Subscribed! Welcome to Amazora.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-green-400 text-sm font-medium py-2"
      >
        ✓ You&apos;re subscribed! Thanks for joining.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com.au"
        className="w-full h-10 px-3.5 rounded-xl glass-dark border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-brand-red/40 transition-colors"
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={loading || !email}
        className="w-full h-10 rounded-xl bg-brand-red text-white font-semibold text-sm shadow-cta hover:shadow-cta-hover transition-all disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Subscribing…' : 'Subscribe →'}
      </motion.button>
    </form>
  )
}
