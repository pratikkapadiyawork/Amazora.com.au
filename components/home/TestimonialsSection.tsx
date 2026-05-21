'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect }     from 'react'
import { AnimatedSection }         from '@/components/shared/AnimatedSection'
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Sarah M.', loc: 'Newtown, NSW', rating: 5, product: 'Marble Chess Set',
    init: 'SM', date: 'March 2026', verified: true,
    text: "Bought the chess set for my husband's 40th — the marble weight is unreal. Arrived in Sydney in 4 days, packaging was proper (not just a plastic bag). Would buy again.",
  },
  {
    name: 'James R.', loc: 'Fitzroy, VIC', rating: 5, product: 'Leather Bifold Wallet',
    init: 'JR', date: 'February 2026', verified: true,
    text: "Dad's birthday — he actually uses this wallet daily. Stitching is tidy, leather has that proper grain. Only small note: box was slightly dented on corner but product was fine.",
  },
  {
    name: 'Emma K.', loc: 'Paddington, QLD', rating: 4, product: 'Premium Hip Flask',
    init: 'EK', date: 'January 2026', verified: true,
    text: "Flask looks great, 21st edition engraving option would've been nice but still happy. Partner uses it camping. Took 6 days to Brisbane which was fine.",
  },
  {
    name: 'Michael T.', loc: 'Subiaco, WA', rating: 5, product: 'Cedar Humidor',
    init: 'MT', date: 'December 2025', verified: true,
    text: "Humidor smells like real cedar, seal is tight. Mate who cigars said it's legit for the price. Free shipping kicked in because I added a mug too.",
  },
  {
    name: 'Olivia P.', loc: 'Norwood, SA', rating: 5, product: 'Ceramic Decor Set',
    init: 'OP', date: 'November 2025', verified: false,
    text: "Housewarming gift for my sister — she posted it on her story same day 😄 Ceramics have a nice matte finish, not the cheap shiny type.",
  },
  {
    name: 'David H.', loc: 'Canberra, ACT', rating: 5, product: 'Ned Kelly Figurine',
    init: 'DH', date: 'October 2025', verified: true,
    text: "Sent to my brother in London as an Aussie gift. Bronze finish photographs well — he said it was the standout present. Tracking email came through next morning.",
  },
]

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(a => (a + 1) % REVIEWS.length), 6000)
    return () => clearInterval(t)
  }, [])

  const r = REVIEWS[idx]
  const prev = () => setIdx(a => (a - 1 + REVIEWS.length) % REVIEWS.length)
  const next = () => setIdx(a => (a + 1) % REVIEWS.length)

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <span className="text-brand-red text-[11px] font-bold tracking-[0.22em] uppercase">
            Real customer reviews
          </span>
          <h2 className="font-display text-display-md text-brand-navy mt-2">
            What Australians Say
          </h2>
          <p className="text-brand-muted text-sm mt-2">Average rating 4.9 · 200+ orders across Australia</p>
        </AnimatedSection>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="bg-brand-cream rounded-card-lg p-8 md:p-12 shadow-card border border-brand-steel/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={18}
                      className={s <= r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-brand-muted/50 text-xs">{r.date}</span>
              </div>

              <blockquote className="font-body text-base md:text-lg text-brand-navy leading-relaxed mb-8">
                &ldquo;{r.text}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-navy/8 flex items-center justify-center text-brand-navy font-bold text-sm">
                    {r.init}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-navy text-sm flex items-center gap-1.5">
                      {r.name}
                      {r.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-brand-steel bg-brand-teal/30 px-1.5 py-0.5 rounded-full">
                          <BadgeCheck size={10} /> Verified
                        </span>
                      )}
                    </p>
                    <p className="text-brand-muted/60 text-xs">{r.loc} · {r.product}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button type="button" onClick={prev} aria-label="Previous review"
            className="absolute left-0 md:left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-brand-muted hover:text-brand-red">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={next} aria-label="Next review"
            className="absolute right-0 md:right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-brand-muted hover:text-brand-red">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {REVIEWS.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)}
              aria-label={`Review ${i + 1}`}
              className={`transition-all rounded-full ${i === idx ? 'w-6 h-2 bg-brand-red' : 'w-2 h-2 bg-brand-red/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
