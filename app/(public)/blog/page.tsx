import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'

const GUIDES = [
  { slug: 'gifts-for-him-australia',       title: 'Ultimate Gift Guide for Him',        desc: 'Chess sets, leather, flasks & Ned Kelly' },
  { slug: 'gifts-for-her-australia',       title: 'Premium Gift Ideas for Her',         desc: 'Ceramic decor, mugs & curated sets' },
  { slug: 'gifts-for-home-australia',      title: 'Gifts for the Home',                 desc: 'Ships, humidors & statement decor' },
  { slug: 'australian-gifts-ned-kelly',    title: 'Australian Icons: Ned Kelly',        desc: 'Bronze figurines & local legends' },
  { slug: 'milestone-birthday-gifts',      title: 'Milestone Birthday Gifts',           desc: '18th to 60th — flasks & keepsakes' },
  { slug: 'cigar-gifts-australia',         title: 'Cigar Gifts Australia',              desc: 'Humidors, cutters & leather cases' },
]

export const metadata: Metadata = {
  title: 'Gift Guides',
  description: 'Expert Australian gift guides — for him, for her, for home, milestones and more.',
  alternates: { canonical: `${SITE.url}/blog` },
  openGraph: { title: 'Gift Guides | Amazora', description: 'Curated gift ideas for every occasion.' },
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-navy text-white py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-brand-teal text-xs font-bold tracking-[0.2em] uppercase">Gift Guides</span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mt-3">Find the Perfect Gift</h1>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Curated ideas for every recipient — written for Australian shoppers.
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {GUIDES.map(g => (
          <Link key={g.slug} href={`/blog/${g.slug}`}
            className="group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-transparent hover:border-brand-red/20">
            <span className="text-brand-red text-[10px] font-bold uppercase tracking-widest">Guide</span>
            <h2 className="font-display text-xl text-brand-navy mt-2 group-hover:text-brand-red transition-colors">{g.title}</h2>
            <p className="text-brand-muted text-sm mt-2">{g.desc}</p>
            <p className="text-brand-red text-sm font-semibold mt-4">Read guide →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
