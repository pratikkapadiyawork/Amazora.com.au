'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'

import { CATEGORY_IMAGES } from '@/lib/category-images'

const CAT_META: Record<string, { img: string | null; emoji: string; gradient: string }> = {
  'chess-sets':  { img: CATEGORY_IMAGES['chess-sets'],  emoji: '♟',  gradient: 'linear-gradient(145deg,#0d2137,#2d5a8e)' },
  'mugs':        { img: CATEGORY_IMAGES['mugs'],        emoji: '☕',  gradient: 'linear-gradient(145deg,#0f2e1a,#2d8a50)' },
  'leather':     { img: CATEGORY_IMAGES['leather'],     emoji: '👜',  gradient: 'linear-gradient(145deg,#2a0e00,#8a4418)' },
  'humidors':    { img: CATEGORY_IMAGES['humidors'],    emoji: '🪵',  gradient: 'linear-gradient(145deg,#0e1f08,#3d6e1a)' },
  'ships':       { img: CATEGORY_IMAGES['ships'],       emoji: '⚓',  gradient: 'linear-gradient(145deg,#020f26,#1a5a9e)' },
  'ceramic':     { img: CATEGORY_IMAGES['ceramic'],     emoji: '🏺',  gradient: 'linear-gradient(145deg,#1e1008,#7a5030)' },
  'hip-flasks':  { img: CATEGORY_IMAGES['hip-flasks'],  emoji: '🥃',  gradient: 'linear-gradient(145deg,#0d1a2e,#2d5080)' },
  'gifts':       { img: CATEGORY_IMAGES['gifts'],       emoji: '🎁',  gradient: 'linear-gradient(145deg,#3a0810,#e63946)' },
}

function CatCard({ cat, i }: { cat: any; i: number }) {
  const meta = CAT_META[cat.slug] ?? { img: null, emoji: '✦', gradient: 'linear-gradient(145deg,#1d3557,#457b9d)' }
  const [imgErr, setImgErr] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}>
      <Link href={`/category/${cat.slug}`}>
        <motion.article
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="relative aspect-[3/4] rounded-[22px] overflow-hidden cursor-pointer group"
          style={{
            background: meta.gradient,
            boxShadow: '0 6px 28px rgba(29,53,87,0.18), 0 2px 8px rgba(29,53,87,0.10)',
          }}>

          {/* Real category photo or emoji fallback */}
          {meta.img && !imgErr ? (
            <Image
              src={meta.img}
              alt={cat.name}
              fill
              className="object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500 group-hover:scale-105"
              style={{ transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.4s' }}
              sizes="(max-width: 640px) 50vw, 25vw"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                style={{ fontSize: 'clamp(3rem,10vw,5rem)' }}>
                {meta.emoji}
              </span>
            </div>
          )}

          {/* Shimmer overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />

          {/* Bottom gradient + text */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(10,20,40,0.9) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-4">
            <p className="font-display font-semibold leading-tight"
              style={{ color: '#f1faee', fontSize: 'clamp(0.85rem,2.5vw,1.05rem)' }}>
              {cat.name}
            </p>
            <p className="font-body text-xs font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ color: '#e63946' }}>
              Shop now →
            </p>
          </div>

          {/* Hover ring */}
          <motion.div className="absolute inset-0 rounded-[22px]"
            whileHover={{ boxShadow: 'inset 0 0 0 2px rgba(230,57,70,0.55)' }} />
        </motion.article>
      </Link>
    </motion.div>
  )
}

export function CategoryGrid({ categories }: { categories: any[] }) {
  const FALLBACK_CATS = [
    { id: '1', slug: 'chess-sets', name: 'Marble Chess Sets' },
    { id: '2', slug: 'mugs',       name: 'Premium Mugs' },
    { id: '3', slug: 'leather',    name: 'Leather & Accessories' },
    { id: '4', slug: 'humidors',   name: 'Humidors' },
    { id: '5', slug: 'ships',      name: 'Ships, Planes & Models' },
    { id: '6', slug: 'ceramic',    name: 'Ceramic & Glass Decor' },
    { id: '7', slug: 'hip-flasks', name: 'Hip Flasks' },
    { id: '8', slug: 'gifts',      name: 'Unique Australian Gifts' },
  ]
  const cats = categories.length > 0 ? categories : FALLBACK_CATS

  return (
    <section style={{ background: '#a8dadc' }} className="py-14 px-4 md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-10">
          <span className="font-body text-[11px] font-bold tracking-[0.22em] uppercase"
            style={{ color: '#e63946' }}>Browse by category</span>
          <h2 className="font-display mt-2"
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#1d3557' }}>
            Shop Our Collections
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {cats.map((cat: any, i: number) => <CatCard key={cat.slug ?? i} cat={cat} i={i} />)}
        </div>
      </div>
    </section>
  )
}
