'use client'

import { motion }    from 'framer-motion'
import { useState }  from 'react'
import { toast }     from 'sonner'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function NewsletterCTA() {
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-24 px-4 md:px-6 overflow-hidden bg-brand-navy">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(211,145,176,0.13)_0%,transparent_70%)]" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-brand-navy/20 blur-[100px] animate-float pointer-events-none gpu" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <span className="text-brand-red text-[11px] font-bold tracking-[0.22em] uppercase">
            Stay inspired
          </span>
          <h2 className="font-display text-display-md text-white mt-3 mb-4">
            Gifts, stories &amp; exclusive offers
          </h2>
          <p className="text-white/55 text-base mb-8">
            Join 8,000+ Australians who shop smarter with Amazora. No spam — just beautiful things.
          </p>

          {done ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-400 font-semibold text-lg"
            >
              ✓ You&apos;re in! Thanks for joining.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="your@email.com.au"
                className="flex-1 h-13 px-5 rounded-2xl glass border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-brand-red/60 transition-colors text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="h-13 px-8 rounded-2xl bg-brand-red text-white font-bold text-sm whitespace-nowrap shadow-cta hover:shadow-cta-hover transition-shadow disabled:opacity-60"
              >
                {loading ? '…' : 'Subscribe →'}
              </motion.button>
            </form>
          )}

          <p className="text-white/25 text-xs mt-4">
            Unsubscribe anytime. No spam. We respect your privacy.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
