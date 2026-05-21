'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function BrandStory() {
  return (
    <section style={{ background: '#1d3557' }} className="py-16 md:py-20 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-4"
              style={{ color: '#a8dadc' }}>Our Story</span>
            <h2 className="font-display mb-6"
              style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', color: '#f1faee', lineHeight: 1.1 }}>
              Curated for the<br />
              <span style={{ color: '#e63946', fontStyle: 'italic' }}>Discerning</span><br />
              Australian.
            </h2>
            <p className="font-body mb-4 leading-relaxed"
              style={{ color: 'rgba(168,218,220,0.65)', fontSize: '1rem' }}>
              Amazora was founded with a simple conviction — Australians deserve access to genuinely
              premium gifts without the premium markup. Every product is chosen for craftsmanship,
              quality, and lasting worth.
            </p>
            <p className="font-body mb-8 leading-relaxed"
              style={{ color: 'rgba(168,218,220,0.45)', fontSize: '0.9rem' }}>
              From handcrafted marble chess sets to iconic Ned Kelly figurines, we source only what
              we&apos;d proudly give ourselves.
            </p>
            <Link href="/about">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="h-12 px-8 rounded-xl font-body font-semibold text-sm"
                style={{ border: '1.5px solid rgba(168,218,220,0.35)', color: '#a8dadc',
                  background: 'rgba(168,218,220,0.06)', backdropFilter: 'blur(8px)' }}>
                Our Story →
              </motion.button>
            </Link>
          </div>

          {/* Single placeholder image card — add your image later */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] lg:aspect-square rounded-[24px] overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #2d5a8e 0%, #1d3557 45%, #152641 100%)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
              border: '1px solid rgba(168,218,220,0.12)',
            }}
            aria-label="Brand image placeholder"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: 'rgba(168,218,220,0.45)' }}>
                Image coming soon
              </span>
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -bottom-3 -left-3 rounded-2xl p-4"
              style={{
                background: 'rgba(29,53,87,0.92)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(168,218,220,0.15)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'rgba(230,57,70,0.15)' }}>🇦🇺</div>
                <div>
                  <p className="font-body font-bold text-sm" style={{ color: '#f1faee' }}>Australian Business</p>
                  <p className="font-body text-xs" style={{ color: 'rgba(168,218,220,0.55)' }}>Free shipping over A$99</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
