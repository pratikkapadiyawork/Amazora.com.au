import type { Metadata } from 'next'
import Link from 'next/link'

const POSTS: Record<string, { title: string; meta: string; body: string; related: string[] }> = {
  'gifts-for-him-australia': {
    title: "The Ultimate Gift Guide for Him — Australia 2026",
    meta: "Premium gifts for him: marble chess sets, leather goods, hip flasks and iconic Ned Kelly figurines. Find the perfect gift for any budget.",
    related: ['milestone-birthday-gifts', 'australian-gifts-ned-kelly'],
    body: `For the man who seems to have everything, the secret is choosing something with genuine weight — literal or metaphorical.

## Marble Chess Sets — A$169.95

Hand-polished from natural marble, these 12-inch sets earn their place on any desk or dining table. The Black & White is the classic; the Black & Coral is for those who prefer something unexpected. Each piece has unique natural veining — no two sets are identical.

## Premium Hip Flasks — A$24.95

304-grade food-safe stainless, hinged cap, velvet-lined box. Available in milestone editions — 18th, 21st, 30th, 40th, 50th, 60th. The kind of gift that gets used at every outdoor event for the next thirty years.

## Leather Belts — A$69.95

Full-grain leather, solid brass buckle, hand-stitched edges. The difference between this and a department store belt is the difference between an heirloom and something disposable.

## Ned Kelly Figurines — A$47.45

Australia's most compelling folk hero in premium bronze finish. For locals, a connection to history. For expats, a reminder of home. For everyone, a conversation piece.`,
  },
  'gifts-for-her-australia': {
    title: "Premium Gift Ideas for Her — Australia 2026",
    meta: "Thoughtful gifts for her: ceramic vases, artisan mugs, curated gift sets. Free delivery across Australia.",
    related: ['gifts-for-home-australia', 'milestone-birthday-gifts'],
    body: `The best gifts for her reflect genuine observation. Not what was convenient — what she would choose for herself.

## Swan Ceramic Vases — A$45.95

Individually hand-glazed, flowing swan form, no two identical. Works as a standalone sculptural piece or with botanicals. Stays on the shelf, not in a drawer.

## Brass Tudor Mugs — A$44.95

Warm brass, hammered texture, food-safe lacquered interior. Milestone engravings available. The morning ritual object that makes coffee feel like a ceremony.

## Dog Ceramic Vases — A$45.95

For the dog lover. Labrador form with individual glaze variations. Function meets affection in a single handcrafted object.`,
  },
  'gifts-for-home-australia': {
    title: "Statement Pieces for the Australian Home — 2026",
    meta: "Premium home decor gifts: model ships, marble ashtrays, ceramic vases. Free delivery across Australia.",
    related: ['gifts-for-him-australia', 'australian-gifts-ned-kelly'],
    body: `A home is defined by the objects within it. These are the pieces that earn their place permanently.

## Big Ship Models — A$39.95

Handcrafted with individually rigged sails and heavy solid base. In a home office it communicates something. In a study it becomes a focal point. In a boardroom it suggests gravitas.

## Marble Ashtrays — A$34.95

Natural marble, unique veining, carved from a single piece. Used as an ashtray, desk accessory, or catch-all — it adds weight to any surface.

## Emirates A380 — A$34.95

Die-cast precision, chrome display stand. The world's largest commercial aircraft. For the aviation enthusiast, it's essential.`,
  },
  'australian-gifts-ned-kelly': {
    title: "The Most Australian Gifts You Can Buy — 2026",
    meta: "Authentic Australian gifts: Ned Kelly figurines, model planes and unique Australian collectibles. Free delivery.",
    related: ['gifts-for-him-australia', 'milestone-birthday-gifts'],
    body: `Forget the novelty boomerangs. The most authentically Australian gifts connect to something real.

## Ned Kelly Figurines — A$47.45

Edward Kelly in bronze, black or copper finish. The defiant pose, the iron armour, the raised weapon. Three finishes, three interpretations, one icon.

The bronze edition is warmth and legacy. The matte black is pure defiance. The copper is the rarest and most luminous — a collector's piece.

## Model Planes — A$34.95

The Emirates A380 carries more Australian passengers to the world than any other aircraft. The Concorde represents the most elegant era of aviation. Both make exceptional gifts for anyone with a connection to flight.

## Why Australian Gifts Matter

A gift with genuine Australian character starts conversations. It represents something. That's the difference between a souvenir and a gift worth keeping.`,
  },
  'milestone-birthday-gifts': {
    title: "The Best Milestone Birthday Gifts — 18th to 60th",
    meta: "18th, 21st, 30th, 40th, 50th birthday gift ideas. Premium engraved gifts for every milestone. Free AU delivery.",
    related: ['gifts-for-him-australia', 'gifts-for-her-australia'],
    body: `The milestone birthdays deserve gifts that mark the occasion properly.

## 18th Birthday — Hip Flask A$24.95

The first proper grown-up gift. Engraved 18th, 304-grade stainless, velvet box. Used at every outdoor event for the next forty years.

## 21st Birthday — Hip Flask A$24.95

21 carries specific weight in Australian culture. The engraved 21st flask says you understood the significance.

## 30th Birthday — Marble Chess Set A$169.95

The 30th is when people begin to take craftsmanship seriously. A marble chess set says the recipient has arrived somewhere.

## 40th Birthday — Brass Tudor Mug A$44.95

Solid brass Tudor tankard. The mug equivalent of a statement piece — it will sit on their desk for the next forty years.

## 50th Birthday — Ned Kelly A$47.45

Half a century deserves an iconic gift. Uniquely Australian for a uniquely significant milestone.

## 60th Birthday — Cedar Humidor A$89.95

By 60, they've earned the proper cigar experience. Spanish cedar, 20-cigar capacity, brass fittings.`,
  },
  'cigar-gifts-australia': {
    title: "The Complete Cigar Gift Guide — Australia 2026",
    meta: "Premium cigar gifts: cedar humidors, leather cases, guillotine cutters. Free AU delivery.",
    related: ['gifts-for-him-australia', 'milestone-birthday-gifts'],
    body: `For the cigar enthusiast, the hierarchy of gifts is clear: storage first, then accessories.

## Premium Cedar Humidor — A$89.95

Spanish cedar-lined, polished brass fittings, holds 20 cigars. The gift that transforms the entire cigar experience. If someone keeps cigars loose in a drawer, this changes everything.

## Leather Cigar Case + Cutter Set — A$59.95

Full-grain leather travel case with integrated guillotine cutter. Everything for the perfect smoke in one pocket-sized package.

## Individual Cigar Cases — from A$14.95

For the enthusiast who already has a humidor. Stainless steel slim cases from A$14.95, leather cases from A$19.95.

## The Right Cutter — from A$14.95

A proper cut is not optional. Surgical-grade stainless blades, spring-loaded mechanism. With matching lighter at A$29.95, it's the complete gift.`,
  },
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return { title: 'Blog | Amazora' }
  return { title: post.title, description: post.meta }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return (
    <div style={{ background: '#f1faee', minHeight: '100vh' }} className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4" style={{ color: '#1d3557' }}>Post not found</h1>
        <Link href="/blog" className="font-body text-sm" style={{ color: '#e63946' }}>← All Gift Guides</Link>
      </div>
    </div>
  )

  const sections = post.body.split('\n\n').filter(Boolean)

  return (
    <div style={{ background: '#f1faee', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(160deg, #1d3557 0%, #457b9d 100%)' }} className="py-14 md:py-20">
        <div className="max-w-[760px] mx-auto px-4 md:px-6">
          <Link href="/blog" className="font-body text-sm mb-5 block" style={{ color: 'rgba(168,218,220,0.55)' }}>
            ← All Gift Guides
          </Link>
          <h1 className="font-display mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#f1faee', lineHeight: 1.15 }}>
            {post.title}
          </h1>
          <p className="font-body" style={{ color: 'rgba(168,218,220,0.6)', fontSize: '1rem' }}>{post.meta}</p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 md:px-6 py-12 space-y-5">
        {sections.map((section, i) => {
          if (section.startsWith('## ')) return (
            <h2 key={i} className="font-display pt-4" style={{ fontSize: '1.6rem', color: '#1d3557' }}>
              {section.slice(3)}
            </h2>
          )
          return (
            <p key={i} className="font-body leading-relaxed" style={{ color: '#457b9d', lineHeight: 1.8 }}>
              {section}
            </p>
          )
        })}

        {post.related.length > 0 && (
          <div className="mt-14 pt-10 border-t" style={{ borderColor: 'rgba(168,218,220,0.3)' }}>
            <h3 className="font-display text-xl mb-5" style={{ color: '#1d3557' }}>More Gift Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.related.map(relSlug => {
                const rel = POSTS[relSlug]
                if (!rel) return null
                return (
                  <Link key={relSlug} href={`/blog/${relSlug}`}>
                    <div className="p-5 rounded-2xl border transition-all hover:-translate-y-1"
                      style={{ background: 'white', borderColor: 'rgba(168,218,220,0.4)', boxShadow: '0 2px 12px rgba(29,53,87,0.07)' }}>
                      <p className="font-display text-base leading-snug mb-1" style={{ color: '#1d3557' }}>{rel.title}</p>
                      <p className="font-body text-xs" style={{ color: '#457b9d' }}>Read guide →</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
