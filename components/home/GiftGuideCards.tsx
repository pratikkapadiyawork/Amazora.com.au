'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const GUIDES = [
  { title: 'For Him',       desc: 'Chess sets, leather, hip flasks, Ned Kelly figurines', href: '/collections/for-him',  gradient: 'linear-gradient(150deg, #0d1e33 0%, #1d3557 50%, #2d5a8e 100%)', accent: '#a8dadc', emoji: '🎯', tag: 'Gift Guide' },
  { title: 'For Her',       desc: 'Ceramic vases, premium mugs, swan decor, gift sets',  href: '/collections/for-her',  gradient: 'linear-gradient(150deg, #3a0810 0%, #7a1020 50%, #e63946 100%)', accent: '#f1faee', emoji: '💝', tag: 'Gift Guide' },
  { title: 'For the Home',  desc: 'Model ships, marble ashtrays, nautical decor',        href: '/collections/for-home', gradient: 'linear-gradient(150deg, #042233 0%, #0a4a6b 50%, #1a7a9e 100%)', accent: '#a8dadc', emoji: '🏡', tag: 'Gift Guide' },
]

export function GiftGuideCards() {
  return (
    <section style={{ background: '#f1faee' }} className="py-16 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase"
            style={{ color: '#e63946' }}>Gift ideas</span>
          <h2 className="font-display mt-2"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#1d3557' }}>
            Find the Perfect Gift
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GUIDES.map((g, i) => (
            <motion.div key={g.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}>
              <Link href={g.href}>
                <motion.article
                  whileHover={{ y: -8, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="relative aspect-[4/5] rounded-[24px] overflow-hidden cursor-pointer group"
                  style={{ background: g.gradient, boxShadow: '0 8px 32px rgba(29,53,87,0.18)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span style={{ fontSize: '5rem', opacity: 0.18 }}
                      whileHover={{ opacity: 0.28, scale: 1.1 }} transition={{ duration: 0.4 }}>
                      {g.emoji}
                    </motion.span>
                  </div>
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(5,10,20,0.88) 100%)' }} />
                  <motion.div className="absolute inset-0 rounded-[24px]"
                    whileHover={{ boxShadow: 'inset 0 0 0 2px rgba(230,57,70,0.5)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <span className="font-body text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-full"
                      style={{ background: 'rgba(230,57,70,0.3)', color: '#f1faee', border: '1px solid rgba(230,57,70,0.4)' }}>
                      {g.tag}
                    </span>
                    <h3 className="font-display mt-3 mb-1.5"
                      style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', color: '#f1faee' }}>
                      {g.title}
                    </h3>
                    <p className="font-body text-sm opacity-65" style={{ color: g.accent }}>{g.desc}</p>
                    <p className="font-body text-sm font-semibold mt-3 group-hover:text-[#e63946] transition-colors"
                      style={{ color: g.accent }}>Shop now →</p>
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
