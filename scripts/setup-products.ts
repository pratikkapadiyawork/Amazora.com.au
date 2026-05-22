/**
 * scripts/setup-products.ts
 * ONE SCRIPT — scans E:\projects\pratik website\new\Product
 * flattens all images to public/products/ with clean URLs,
 * seeds entire product catalog with real prices + 20% markup for display.
 * Run: npx tsx scripts/setup-products.ts
 */

// Load .env.local first so DATABASE_URL is the real postgres URL, not Prisma Accelerate proxy
import { config } from 'dotenv'
config({ path: '.env.local', override: true })

import fs   from 'fs'
import path from 'path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Use DIRECT_URL for scripts — bypasses the connection pooler
const connStr = process.env.DIRECT_URL ?? process.env.DATABASE_URL!
const pool    = new Pool({ connectionString: connStr })
const prisma  = new PrismaClient({ adapter: new PrismaPg(pool) })
const PUBLIC_DIR = path.join(process.cwd(), 'public', 'products')
const SRC_DIR    = path.join('E:\\projects\\pratik website\\new\\Product')

// ── UTILITIES ─────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s.toLowerCase()
    .replace(/[()$"'\[\]]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function displayPrice(price: number) {
  // Show 20% higher as compare price, rounded to nearest .95
  return (Math.ceil(price * 1.20 / 5) * 5) - 0.05
}

// ── FLATTEN all images from source tree → public/products/ ────────────────
function flattenAll() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  if (!fs.existsSync(SRC_DIR)) {
    console.warn(`  ⚠ Source dir not found: ${SRC_DIR} — skipping image flatten.`)
    return
  }

  let copied = 0
  let skipped = 0

  function walk(dir: string, parts: string[] = []): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath, [...parts, entry.name])
      } else {
        const ext = path.extname(entry.name).toLowerCase()
        // Skip HEIC (browser-incompatible), zips, and non-image files
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue
        const safeExt  = ext === '.jpeg' ? '.jpg' : ext
        const base     = path.basename(entry.name, ext)
        const slug     = [...parts.map(toSlug), toSlug(base)].join('--')
        const dest     = path.join(PUBLIC_DIR, `${slug}${safeExt}`)
        if (!fs.existsSync(dest)) {
          fs.copyFileSync(fullPath, dest)
          copied++
        } else {
          skipped++
        }
      }
    }
  }

  walk(SRC_DIR)
  console.log(`  ✓ ${copied} images copied, ${skipped} already existed`)
}

// ── FIND images matching a keyword ────────────────────────────────────────
function findImages(keyword: string, limit = 5): string[] {
  if (!fs.existsSync(PUBLIC_DIR)) return []
  const kw  = keyword.toLowerCase()
  const all = fs.readdirSync(PUBLIC_DIR)
  const hit = all.filter(f =>
    f.toLowerCase().includes(kw) &&
    (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
  )
  return hit.slice(0, limit).map(f => `/products/${f}`)
}

// ── CATEGORIES ────────────────────────────────────────────────────────────
const CATS = [
  { slug: 'chess-sets', name: 'Marble Chess Sets',      sortOrder: 1, image: '/images/cat-chess-sets.jpg' },
  { slug: 'mugs',       name: 'Premium Mugs',            sortOrder: 2, image: '/images/cat-mugs.jpg'      },
  { slug: 'leather',    name: 'Leather & Accessories',   sortOrder: 3, image: '/images/cat-leather.jpg'   },
  { slug: 'humidors',   name: 'Humidors',                sortOrder: 4, image: '/images/cat-humidors.jpg'  },
  { slug: 'ships',      name: 'Ships, Planes & Models',  sortOrder: 5, image: '/images/cat-ships.jpg'     },
  { slug: 'ceramic',    name: 'Ceramic & Glass Decor',   sortOrder: 6, image: '/images/cat-ceramic.jpg'   },
  { slug: 'hip-flasks', name: 'Hip Flasks',              sortOrder: 7, image: '/images/cat-hip-flasks.jpg'},
  { slug: 'gifts',      name: 'Unique Australian Gifts', sortOrder: 8, image: '/images/cat-gifts.jpg'     },
]

// ── PRODUCTS ──────────────────────────────────────────────────────────────
// imgKey must be a substring of the flattened filename produced by flattenAll().
// Naming rule: toSlug(grandparent) + '--' + toSlug(parent) + '--' + toSlug(filename)
// e.g. Barrel Mug-($34.95)/Plan Mug/1.jpg → barrel-mug-34-95--plan-mug--1.jpg
const PRODUCTS: Array<{
  slug: string; name: string; price: number; cat: string
  imgKey: string; featured?: boolean; sku?: string
  short: string; desc: string; tags: string[]
}> = [

  // ═══════════════════════════════════════════════════════
  // MARBLE CHESS SETS  (12 inch Marble Chess Set → 12-inch-marble-chess-set)
  //   Black-White (12")  → black-white-12
  //   Black-Coral(12")   → black-coral12
  //   Green-White(12")   → green-white12
  // ═══════════════════════════════════════════════════════
  {
    slug: 'chess-set-black-white', name: 'Marble Chess Set — Black & White Edition',
    price: 169.95, cat: 'chess-sets', imgKey: 'black-white-12',
    featured: true, sku: 'MCS-BW',
    short: 'Hand-polished black & white marble chess with weighted pieces.',
    desc: 'A stunning 12-inch marble chess set featuring hand-polished black and white marble pieces with genuine stone weight. Each piece is individually crafted from natural marble, giving it a unique pattern found nowhere else. The board features deep black and pure white alternating squares. Perfect as a showpiece or for serious chess players. Presented in a premium gift box.',
    tags: ['chess', 'marble', 'gift', 'game'],
  },
  {
    slug: 'chess-set-black-coral', name: 'Marble Chess Set — Black & Coral Edition',
    price: 169.95, cat: 'chess-sets', imgKey: 'black-coral12',
    featured: true, sku: 'MCS-BC',
    short: 'Striking black and coral marble chess — a bold statement piece.',
    desc: 'A bold 12-inch marble chess set pairing dramatic black marble with warm coral pieces. The contrast between dark black and vibrant coral creates a striking visual display. Each piece showcases unique natural veining — no two are identical. An exceptional gift for chess enthusiasts or as luxury home decor.',
    tags: ['chess', 'marble', 'coral', 'gift', 'unique'],
  },
  {
    slug: 'chess-set-green-white', name: 'Marble Chess Set — Forest Green & White',
    price: 169.95, cat: 'chess-sets', imgKey: 'green-white12',
    featured: false, sku: 'MCS-GW',
    short: "Rare forest green and white marble chess. A collector's edition.",
    desc: "A rare and sophisticated marble chess set featuring deep forest green marble with crisp white pieces. The rich green marble showcases natural white veining making each piece completely unique. Both a functional chess set and an art piece worthy of permanent display.",
    tags: ['chess', 'marble', 'green', 'collector'],
  },

  // ═══════════════════════════════════════════════════════
  // BARREL MUGS  (Barrel Mug-($34.95) → barrel-mug-34-95)
  //   Plan Mug              → plan-mug
  //   18th mug-($34.95)     → 18th-mug-34-95
  //   30th                  → 30th
  //   40th                  → 40th
  // ═══════════════════════════════════════════════════════
  {
    slug: 'barrel-mug-plain', name: 'Barrel Mug — Rustic Oak Finish',
    price: 34.95, cat: 'mugs', imgKey: 'barrel-mug-34-95--plan-mug',
    featured: true, sku: 'MUG-BAR-PLN',
    short: 'Handcrafted barrel-shaped mug with genuine rustic oak finish.',
    desc: "A beautifully handcrafted barrel-shaped mug that channels the warmth of a traditional whiskey barrel. The rustic oak-style finish develops richer character over time. Wide base for stability, generous 400ml capacity. An outstanding gift for anyone who appreciates artisan craftsmanship.",
    tags: ['mug', 'barrel', 'oak', 'coffee', 'gift'],
  },
  {
    slug: 'barrel-mug-18th', name: 'Barrel Mug — 18th Birthday Edition',
    price: 34.95, cat: 'mugs', imgKey: 'barrel-mug-34-95--18th-mug',
    featured: false, sku: 'MUG-BAR-18',
    short: 'The perfect 18th birthday gift — engraved barrel mug.',
    desc: "Celebrate an 18th birthday in unforgettable style with this personalised barrel-shaped mug. Engraved with a classic 18th birthday design. 400ml capacity. Ships in a premium gift-ready box. A gift they'll genuinely keep and use for years.",
    tags: ['mug', '18th', 'birthday', 'gift', 'engraved'],
  },
  {
    slug: 'barrel-mug-30th', name: 'Barrel Mug — 30th Birthday Edition',
    price: 34.95, cat: 'mugs', imgKey: 'barrel-mug-34-95--30th',
    featured: false, sku: 'MUG-BAR-30',
    short: "A milestone 30th birthday gift they'll actually use every day.",
    desc: "The 30th birthday deserves something more than a generic card. This barrel mug with a 30th birthday design strikes the perfect balance between meaningful and practical. 400ml, oak finish, premium gift box.",
    tags: ['mug', '30th', 'birthday', 'milestone', 'gift'],
  },
  {
    slug: 'barrel-mug-40th', name: 'Barrel Mug — 40th Birthday Edition',
    price: 34.95, cat: 'mugs', imgKey: 'barrel-mug-34-95--40th',
    featured: false, sku: 'MUG-BAR-40',
    short: '40 years of excellence — celebrated in barrel mug form.',
    desc: "Forty deserves a proper celebration. This oak-finish barrel mug with a 40th birthday design is the kind of gift that sits on the desk for decades, sparking conversation every time someone asks about it.",
    tags: ['mug', '40th', 'birthday', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // BRASS TUDOR MUG  (Brass Tudor mug-($44.95) → brass-tudor-mug-44-95)
  //   No Plain subfolder — plain images directly in parent
  //   18th, 21st, 30th, 50th, 60th subfolders
  // ═══════════════════════════════════════════════════════
  {
    slug: 'brass-tudor-mug-plain', name: 'Brass Tudor Mug — Vintage Handcrafted Tankard',
    price: 44.95, cat: 'mugs', imgKey: 'brass-tudor-mug-44-95',
    featured: true, sku: 'MUG-TUD',
    short: 'Genuine brass Tudor-style tankard. Commands attention on any table.',
    desc: 'A commanding genuine brass Tudor-style tankard inspired by 16th century English drinking vessels. Hammered texture finish, food-safe lacquered interior, dishwasher-friendly. For ale, mead, coffee, or whiskey — drinking from this mug is an experience in itself.',
    tags: ['mug', 'brass', 'tudor', 'tankard', 'vintage', 'handcrafted'],
  },
  {
    slug: 'brass-tudor-mug-18th', name: 'Brass Tudor Mug — 18th Birthday Edition',
    price: 44.95, cat: 'mugs', imgKey: 'brass-tudor-mug-44-95--18th',
    featured: false, sku: 'MUG-TUD-18',
    short: 'Genuine brass Tudor tankard engraved for the 18th.',
    desc: "The most memorable 18th birthday gift in the room. Solid brass Tudor-style tankard with a beautifully engraved 18th birthday design. The recipient will be reminded of this milestone every morning for the rest of their lives.",
    tags: ['mug', 'brass', '18th', 'birthday', 'tankard'],
  },
  {
    slug: 'brass-tudor-mug-21st', name: 'Brass Tudor Mug — 21st Birthday Edition',
    price: 44.95, cat: 'mugs', imgKey: 'brass-tudor-mug-44-95--21st',
    featured: false, sku: 'MUG-TUD-21',
    short: "Turn 21 properly — with a solid brass Tudor tankard.",
    desc: "A 21st that deserves to be remembered. This genuine brass Tudor tankard engraved with a classic 21st design is the gift that keeps giving — every morning coffee becomes a celebration.",
    tags: ['mug', 'brass', '21st', 'birthday', 'tankard'],
  },

  // ═══════════════════════════════════════════════════════
  // TUDOR MUG  (Tudor Mug → tudor-mug)
  //   Plain → plain
  // ═══════════════════════════════════════════════════════
  {
    slug: 'tudor-mug-plain', name: 'Tudor Mug — Classic Artisan Collection',
    price: 34.95, cat: 'mugs', imgKey: 'tudor-mug--plain',
    featured: false, sku: 'MUG-TUD-CER',
    short: 'Classic Tudor-style artisan mug. For those who appreciate craft.',
    desc: 'A beautifully crafted Tudor-style mug that brings old-world charm to your morning routine. Each mug has a warm artisan finish with subtle glazing variations — a mark of genuine craft.',
    tags: ['mug', 'tudor', 'artisan', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // BELTS  (Belt-($69.95) → belt-69-95)
  //   B-1 → b-1,  B-2 → b-2,  B-3 → b-3, etc.
  // ═══════════════════════════════════════════════════════
  {
    slug: 'leather-belt-classic', name: 'Premium Leather Belt — Full Grain Classic',
    price: 69.95, cat: 'leather', imgKey: 'belt-69-95--b-1',
    featured: true, sku: 'BELT-01',
    short: 'Full-grain leather belt crafted to last decades, not seasons.',
    desc: 'A genuinely premium full-grain leather belt that improves with age. Made from a single piece of full-grain hide with natural markings. Solid brass buckle, hand-stitched edges. The kind of belt that gets passed down, not thrown out.',
    tags: ['belt', 'leather', 'full grain', 'gift', 'men'],
  },
  {
    slug: 'leather-belt-formal', name: 'Premium Leather Belt — Formal Black',
    price: 69.95, cat: 'leather', imgKey: 'belt-69-95--b-2',
    featured: false, sku: 'BELT-02',
    short: 'Black full-grain leather. From the boardroom to black-tie.',
    desc: 'The belt every professional wardrobe needs. Black full-grain leather with a refined polished buckle. Transitions from daily office wear to formal occasions. Arrives in a premium Amazora gift box.',
    tags: ['belt', 'leather', 'black', 'formal'],
  },
  {
    slug: 'leather-belt-b3', name: 'Premium Leather Belt — Tan Brown Heritage',
    price: 69.95, cat: 'leather', imgKey: 'belt-69-95--b-3',
    featured: false, sku: 'BELT-03',
    short: 'Rich tan heritage leather belt. Ages beautifully.',
    desc: 'A warm tan heritage leather belt that develops a rich patina with wear. Full-grain hide, hand-stitched edges, solid brass buckle.',
    tags: ['belt', 'leather', 'tan', 'heritage'],
  },

  // ═══════════════════════════════════════════════════════
  // HIP FLASKS  (Hip-Flask → hip-flask)
  //   Plain, 18th, 21st, 30th, 40th, 50th, 60th, Black, Jack Danial, JimBeam
  // ═══════════════════════════════════════════════════════
  {
    slug: 'hip-flask-plain', name: 'Hip Flask — Stainless Steel Gentleman Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--plain',
    featured: true, sku: 'HF-PLN',
    short: 'Premium 6oz stainless steel hip flask. Leak-proof, gift-ready.',
    desc: "A gentleman's essential. 6oz 304-grade food-safe stainless steel with brushed finish. Hinged cap (never lost), genuine leather sleeve. 180ml capacity. Arrives in velvet-lined gift box.",
    tags: ['hip flask', 'stainless steel', 'gift', 'whiskey', 'gentleman'],
  },
  {
    slug: 'hip-flask-18th', name: 'Hip Flask — 18th Birthday Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--18th',
    featured: false, sku: 'HF-18',
    short: 'Engraved 18th birthday hip flask. The first proper grown-up gift.',
    desc: "An 18th birthday they'll remember every time they reach for this flask. Premium 304 stainless steel, 6oz, engraved 18th design, velvet-lined gift box.",
    tags: ['hip flask', '18th', 'birthday', 'engraved'],
  },
  {
    slug: 'hip-flask-21st', name: 'Hip Flask — 21st Birthday Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--21st',
    featured: true, sku: 'HF-21',
    short: "A 21st birthday gift that outlasts the hangover.",
    desc: "21 is the milestone worth marking properly. 6oz 304 stainless, engraved 21st design, hinged cap, leather sleeve, velvet box.",
    tags: ['hip flask', '21st', 'birthday', 'milestone'],
  },
  {
    slug: 'hip-flask-30th', name: 'Hip Flask — 30th Birthday Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--30th',
    featured: false, sku: 'HF-30',
    short: '30 never looked this good. Engraved milestone flask.',
    desc: "The 30th deserves a proper send-off. Engraved 30th birthday design on 304 stainless steel. 6oz, hinged cap, leather sleeve.",
    tags: ['hip flask', '30th', 'birthday'],
  },
  {
    slug: 'hip-flask-jack-daniels', name: "Hip Flask — Jack Daniel's Tribute Edition",
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--jack-danial',
    featured: false, sku: 'HF-JD',
    short: 'For the Jack fan. Premium tribute flask, gift-ready.',
    desc: "For the person who knows their Old No. 7. Premium stainless steel hip flask with a Jack Daniel's inspired tribute design. 6oz, 304 stainless, hinged cap.",
    tags: ['hip flask', 'jack daniels', 'whiskey', 'gift'],
  },
  {
    slug: 'hip-flask-jim-beam', name: 'Hip Flask — Jim Beam Tribute Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--jimbeam',
    featured: false, sku: 'HF-JB',
    short: "The bourbon lover's companion. Jim Beam tribute flask.",
    desc: "For the friend who always brings good bourbon to the party. Jim Beam tribute design on premium 304 stainless steel. 6oz, hinged cap, leather sleeve.",
    tags: ['hip flask', 'jim beam', 'bourbon', 'gift'],
  },
  {
    slug: 'hip-flask-black', name: 'Hip Flask — Matte Black Edition',
    price: 24.95, cat: 'hip-flasks', imgKey: 'hip-flask--black',
    featured: false, sku: 'HF-BLK',
    short: 'Sleek matte black. Modern and understated.',
    desc: 'For those who prefer their style clean and modern. Matte black powder-coated 304 stainless steel. Non-reflective surface, 6oz, secure hinged cap.',
    tags: ['hip flask', 'black', 'matte', 'modern'],
  },

  // ═══════════════════════════════════════════════════════
  // SHIPS  (Big Ship-($39.95) → big-ship-39-95 ; Small Ship → small-ship)
  // ═══════════════════════════════════════════════════════
  {
    slug: 'big-ship-model-1', name: 'Big Ship Model — Premium Collector Display',
    price: 39.95, cat: 'ships', imgKey: 'big-ship-39-95--ship-1',
    featured: true, sku: 'SHIP-BIG-01',
    short: 'Handcrafted model ship. A statement piece for any room.',
    desc: "A magnificent handcrafted model ship with extraordinary detail — individually rigged sails, hand-painted hull markings, heavy solid base. An exceptional retirement gift or Father's Day present.",
    tags: ['ship', 'model', 'nautical', 'decor', 'collector', 'gift'],
  },
  {
    slug: 'big-ship-model-2', name: "Big Ship Model — Admiral's Edition",
    price: 39.95, cat: 'ships', imgKey: 'big-ship-39-95--ship-2',
    featured: false, sku: 'SHIP-BIG-02',
    short: "Admiral's Edition — a different silhouette, same excellence.",
    desc: "The Admiral's Edition model ship features a distinct hull design and rigging style. The same handcrafted quality and extraordinary attention to detail.",
    tags: ['ship', 'model', 'admiral', 'nautical'],
  },
  {
    slug: 'small-ship-model-1', name: 'Small Ship Model — Classic Sailboat',
    price: 29.95, cat: 'ships', imgKey: 'small-ship--s-1',
    featured: false, sku: 'SHIP-SM-01',
    short: 'Compact sailboat model. Perfect for desk or shelf.',
    desc: 'A beautifully detailed compact sailboat model that brings the romance of the sea to any desk or shelf.',
    tags: ['ship', 'sailboat', 'model', 'desk', 'compact'],
  },
  {
    slug: 'small-ship-model-2', name: 'Small Ship Model — Classic Schooner',
    price: 29.95, cat: 'ships', imgKey: 'small-ship--s-2',
    featured: false, sku: 'SHIP-SM-02',
    short: 'Classic schooner model. Maritime history on your shelf.',
    desc: 'A classic two-masted schooner rendered in handcrafted detail. From the individually knotted rigging to the hand-painted hull stripe, a genuine piece of maritime artistry.',
    tags: ['ship', 'schooner', 'model', 'maritime'],
  },

  // ═══════════════════════════════════════════════════════
  // PLANES  (Small Plane → small-plane)
  //   Emirates A380 → emirates-a380
  //   British Concoard (sic) → british-concoard
  //   Quatar (sic) → quatar
  //   Turkish Airlines → turkish-airlines
  // ═══════════════════════════════════════════════════════
  {
    slug: 'model-plane-emirates-a380', name: 'Emirates A380 Model Plane — Display Edition',
    price: 34.95, cat: 'ships', imgKey: 'small-plane--emirates-a380',
    featured: true, sku: 'PLN-EK',
    short: "Emirates A380 die-cast model. Aviation lover's dream gift.",
    desc: "The world's largest passenger aircraft rendered in exquisite die-cast detail. Iconic Emirates livery, four engine nacelles, double-deck fuselage — every detail exact. Chrome display stand included.",
    tags: ['plane', 'emirates', 'a380', 'aviation', 'model', 'gift'],
  },
  {
    slug: 'model-plane-concorde', name: 'British Concorde — Supersonic Icon Model',
    price: 34.95, cat: 'ships', imgKey: 'small-plane--british-concoard',
    featured: false, sku: 'PLN-CONC',
    short: 'The most beautiful plane ever built, in your hands.',
    desc: 'The legendary Concorde supersonic airliner captured in precise model form. Impossibly elegant delta wing, needle nose — aviation history at its finest. Chrome stand and presentation box included.',
    tags: ['plane', 'concorde', 'supersonic', 'aviation', 'model', 'icon'],
  },
  {
    slug: 'model-plane-qatar', name: 'Qatar Airways Model Plane',
    price: 34.95, cat: 'ships', imgKey: 'small-plane--quatar',
    featured: false, sku: 'PLN-QR',
    short: 'Qatar Airways livery model. Gift for the frequent flyer.',
    desc: 'A detailed die-cast model featuring the iconic Qatar Airways livery in its distinctive burgundy and white. Chrome stand, presentation box.',
    tags: ['plane', 'qatar', 'aviation', 'model', 'gift'],
  },
  {
    slug: 'model-plane-turkish-airlines', name: 'Turkish Airlines Model Plane',
    price: 34.95, cat: 'ships', imgKey: 'small-plane--turkish-airlines',
    featured: false, sku: 'PLN-TK',
    short: 'Turkish Airlines model for the aviation collector.',
    desc: "The iconic Turkish Airlines livery in die-cast model form. Chrome stand and presentation box.",
    tags: ['plane', 'turkish', 'aviation', 'model'],
  },

  // ═══════════════════════════════════════════════════════
  // NED KELLY  (Ned Kelly → ned-kelly)
  //   1 Gun Big → 1-gun-big   |  1 Gun Small → 1-gun-small
  //   2 Gun Small → 2-gun-small   |  Arm Extended → arm-extended
  //   Bronze → bronze  |  Copper → copper  |  Black → black
  // ═══════════════════════════════════════════════════════
  {
    slug: 'ned-kelly-1-gun-bronze', name: 'Ned Kelly — 1 Gun, Bronze Finish',
    price: 49.95, cat: 'gifts', imgKey: 'ned-kelly--1-gun-big--bronze',
    featured: true, sku: 'NK-1G-BRZ',
    short: "Australia's most iconic outlaw in premium bronze.",
    desc: "Australia's most iconic outlaw rendered in stunning bronze finish. Ned Kelly in his famous armour with a single pistol drawn — a powerful image representing the Australian frontier spirit.",
    tags: ['ned kelly', 'australian', 'figurine', 'bronze', 'icon', 'gift', 'history'],
  },
  {
    slug: 'ned-kelly-1-gun-black', name: 'Ned Kelly — 1 Gun, Matte Black',
    price: 49.95, cat: 'gifts', imgKey: 'ned-kelly--1-gun-small--black',
    featured: false, sku: 'NK-1G-BLK',
    short: 'Ned Kelly in striking matte black. Pure Australian defiance.',
    desc: "Australia's famous outlaw in a bold matte black finish that creates a dramatic silhouette reminiscent of the iron armour itself.",
    tags: ['ned kelly', 'australian', 'figurine', 'black', 'matte', 'icon'],
  },
  {
    slug: 'ned-kelly-1-gun-copper', name: 'Ned Kelly — 1 Gun, Copper Finish',
    price: 49.95, cat: 'gifts', imgKey: 'ned-kelly--1-gun-small--copper',
    featured: false, sku: 'NK-1G-COP',
    short: "Ned Kelly in warm copper — the rarest finish.",
    desc: "The rarest finish in the Ned Kelly collection. The warm copper tone brings out extraordinary detail in the armour plating and gives the figure a living, luminous quality under any light.",
    tags: ['ned kelly', 'australian', 'figurine', 'copper', 'collector'],
  },
  {
    slug: 'ned-kelly-2-gun-bronze', name: 'Ned Kelly — 2 Guns, Bronze Finish',
    price: 54.95, cat: 'gifts', imgKey: 'ned-kelly--2-gun-small--bronze',
    featured: true, sku: 'NK-2G-BRZ',
    short: 'Both pistols drawn. Maximum impact. Pure Australian legend.',
    desc: "The ultimate Ned Kelly figurine — both pistols drawn, armour gleaming in premium bronze. This dramatic two-gun pose represents the height of the Kelly Gang's legendary last stand.",
    tags: ['ned kelly', 'australian', 'figurine', 'bronze', '2 gun', 'collector'],
  },
  {
    slug: 'ned-kelly-arm-extended-bronze', name: 'Ned Kelly — Arm Extended, Bronze',
    price: 54.95, cat: 'gifts', imgKey: 'ned-kelly--arm-extended--bronze',
    featured: false, sku: 'NK-ARM-BRZ',
    short: 'Ned Kelly arm extended — the defiant pose. Bronze edition.',
    desc: 'The most defiant Ned Kelly pose — arm fully extended, staring down his pursuers. Premium bronze finish, museum-quality detail.',
    tags: ['ned kelly', 'australian', 'bronze', 'defiant', 'collector'],
  },

  // ═══════════════════════════════════════════════════════
  // HUMIDORS  (Humidors → humidors)
  //   No subfolders — files are directly: IMG_8062, IMG_8063, IMG_8064
  // ═══════════════════════════════════════════════════════
  {
    slug: 'cedar-humidor', name: 'Premium Cedar Wood Humidor — Classic Collection',
    price: 89.95, cat: 'humidors', imgKey: 'humidors--img-8062',
    featured: true, sku: 'HUM-01',
    short: 'Spanish cedar-lined humidor for up to 20 cigars.',
    desc: 'A premium Spanish cedar-lined humidor that every cigar enthusiast deserves. Lacquered wood veneer exterior, polished brass hinges and clasp. Spanish cedar interior naturally regulates humidity. Holds up to 20 premium cigars. Removable cedar tray.',
    tags: ['humidor', 'cedar', 'cigar', 'luxury', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // CERAMIC VASES  (Swan Ceramic Vase → swan-ceramic-vase)
  //                (Dog Ceramic Vase  → dog-ceramic-vase)
  // ═══════════════════════════════════════════════════════
  {
    slug: 'swan-ceramic-vase', name: 'Swan Ceramic Vase — Hand-Finished Elegance',
    price: 45.95, cat: 'ceramic', imgKey: 'swan-ceramic-vase',
    featured: true, sku: 'CER-SWAN-01',
    short: 'Graceful swan-form ceramic vase. A timeless decor piece.',
    desc: "A graceful swan-form ceramic vase individually hand-finished — no two are identical. Works beautifully as a standalone sculptural piece or with flowers and dried botanicals. An extraordinary housewarming or Mother's Day gift.",
    tags: ['ceramic', 'vase', 'swan', 'decor', 'gift', 'handmade'],
  },
  {
    slug: 'swan-ceramic-vase-2', name: 'Swan Ceramic Vase — Sculptural Edition',
    price: 45.95, cat: 'ceramic', imgKey: 'swan-ceramic-vase',
    featured: false, sku: 'CER-SWAN-02',
    short: 'Second swan form — different glaze, same grace.',
    desc: 'A complementary swan ceramic vase with a distinct glaze and slightly different form to our original. Makes a beautiful pair or a standout solo piece.',
    tags: ['ceramic', 'vase', 'swan', 'decor'],
  },
  {
    slug: 'dog-ceramic-vase', name: 'Dog Ceramic Vase — Sculpted Labrador Portrait',
    price: 45.95, cat: 'ceramic', imgKey: 'dog-ceramic-vase',
    featured: false, sku: 'CER-DOG-01',
    short: 'Charming dog-shaped ceramic vase. Perfect for dog lovers.',
    desc: "A delightful ceramic vase sculpted in the likeness of a Labrador. Individually finished with subtle glaze variations. Holds small flower arrangements beautifully. An excellent birthday or housewarming gift.",
    tags: ['ceramic', 'vase', 'dog', 'labrador', 'decor', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // ASHTRAYS
  // ═══════════════════════════════════════════════════════
  {
    slug: 'marble-ashtray-m1', name: 'Marble Ashtray — Natural Stone Classic',
    price: 34.95, cat: 'ceramic', imgKey: 'marble-ashtray--m-1',
    featured: false, sku: 'ASH-MAR-01',
    short: 'Heavy natural marble ashtray with unique veining. Timeless.',
    desc: 'A substantial natural marble ashtray carved from a single piece of stone. Each features unique veining found nowhere else in the world. Functions equally well as an ashtray, desk accessory, or jewellery holder.',
    tags: ['ashtray', 'marble', 'natural stone', 'decor', 'gift'],
  },
  {
    slug: 'glass-ashtray-premium', name: 'Crystal Glass Ashtray — Heavy Edition',
    price: 29.95, cat: 'ceramic', imgKey: 'glass-ashtray',
    featured: false, sku: 'ASH-GLS-01',
    short: 'Heavy crystal glass ashtray. A desk icon.',
    desc: 'A heavy-bottomed crystal glass ashtray with satisfying weight and clarity. Geometric facets throw prismatic reflections. Use as an ashtray, catch-all for keys, or standalone desk accessory.',
    tags: ['ashtray', 'crystal', 'glass', 'desk', 'premium'],
  },

  // ═══════════════════════════════════════════════════════
  // CIGAR CASES  (Cigar Case → cigar-case)
  //   Steel-1. ($14.95) → steel-1-14-95
  //   Black-1. ($19.95) → black-1-19-95  (leather)
  //   Case with Cutter -($59.95) → case-with-cutter-59-95
  // ═══════════════════════════════════════════════════════
  {
    slug: 'cigar-case-steel-14', name: 'Cigar Case — Stainless Steel Slim',
    price: 14.95, cat: 'leather', imgKey: 'cigar-case--steel-1',
    featured: false, sku: 'CIG-CASE-SS1',
    short: 'Slim stainless steel cigar case. Pocket-ready protection.',
    desc: 'A sleek stainless steel cigar case that protects one premium cigar without bulk. Brushed finish, secure snap closure. Fits easily in a shirt pocket or jacket.',
    tags: ['cigar', 'case', 'stainless steel', 'slim'],
  },
  {
    slug: 'cigar-case-leather-black', name: 'Leather Cigar Case — Black 2-Cigar',
    price: 19.95, cat: 'leather', imgKey: 'cigar-case--black-1',
    featured: false, sku: 'CIG-CASE-BK',
    short: 'Full-grain leather 2-cigar case. Elegant and protective.',
    desc: 'Full-grain leather cigar case holding 2 standard-sized cigars in lined individual slots. Magnetic closure, hand-stitched edges, slim enough for a jacket pocket.',
    tags: ['cigar', 'case', 'leather', 'black', 'gift'],
  },
  {
    slug: 'cigar-case-with-cutter', name: 'Leather Cigar Case + Cutter Set',
    price: 59.95, cat: 'leather', imgKey: 'cigar-case--case-with-cutter',
    featured: true, sku: 'CIG-SET',
    short: 'Complete set: leather case + guillotine cutter. Gift-ready.',
    desc: 'Everything a cigar enthusiast needs. Full-grain leather case for 2 cigars, integrated guillotine cutter for a perfect cut every time. Velvet-lined interior, jacket-pocket slim.',
    tags: ['cigar', 'case', 'cutter', 'set', 'leather', 'gift'],
  },
  {
    slug: 'cigar-cutter-cc1', name: 'Cigar Cutter — Precision Guillotine CC1',
    price: 14.95, cat: 'leather', imgKey: 'cigar-cutter--cc1-1495',
    featured: true, sku: 'CIG-CUT-CC1',
    short: 'Surgical-grade stainless guillotine cutter. Fits all standard ring gauges.',
    desc: 'Surgical-grade stainless steel guillotine cutter with a razor-sharp blade. Fits all standard ring gauges. Summer sale favourite — the perfect cigar essential.',
    tags: ['cigar', 'cutter', 'guillotine', 'stainless steel', 'summer-sale', 'gift'],
  },
  {
    slug: 'cigar-cutter-cc2', name: 'Cigar Cutter — Double-Blade Guillotine',
    price: 16.95, cat: 'leather', imgKey: 'cigar-cutter--cc2',
    featured: false, sku: 'CIG-CUT-CC2',
    short: 'Double-blade guillotine for a clean, even cut.',
    desc: 'Premium double-blade guillotine cigar cutter. Self-sharpening stainless blades, ergonomic grip, pocket-sized.',
    tags: ['cigar', 'cutter', 'guillotine', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // GUITARS  (Guitar ($29.95) → guitar-29-95)
  //   G-1 → g-1,  G-2 → g-2, etc.
  // ═══════════════════════════════════════════════════════
  {
    slug: 'miniature-guitar-acoustic', name: 'Miniature Guitar — Acoustic Display Replica',
    price: 29.95, cat: 'gifts', imgKey: 'guitar-29-95--g-1',
    featured: false, sku: 'GTR-AC-01',
    short: "Full-detail miniature acoustic guitar. A music lover's gift.",
    desc: "A beautifully crafted miniature acoustic guitar capturing every detail — tuning pegs, soundhole rosette, bridge pins. Real metal strings, tonewood body. Easel stand included.",
    tags: ['guitar', 'miniature', 'music', 'gift', 'display'],
  },
  {
    slug: 'miniature-guitar-g2', name: 'Miniature Guitar — Electric Style Replica',
    price: 29.95, cat: 'gifts', imgKey: 'guitar-29-95--g-2',
    featured: false, sku: 'GTR-EL-02',
    short: 'Electric guitar miniature replica. Rock music gift.',
    desc: 'A detailed miniature electric guitar replica with body contouring, pickup detail, and control knobs accurately represented. Comes with a display stand.',
    tags: ['guitar', 'miniature', 'electric', 'music', 'gift'],
  },

  // ═══════════════════════════════════════════════════════
  // MANICURE SET  (Manicure Set → manicure-set)
  //   T-1 → t-1
  // ═══════════════════════════════════════════════════════
  {
    slug: 'manicure-set-premium', name: 'Premium Stainless Steel Manicure Set',
    price: 39.95, cat: 'gifts', imgKey: 'manicure-set--t-1',
    featured: false, sku: 'MAN-SET-01',
    short: '9-piece surgical-grade stainless manicure set in leather case.',
    desc: '9-piece manicure set in 420-grade stainless steel. Clippers (large/small), cuticle pusher, nipper, file, scissors, tweezers, ear pick, stored in a premium leather roll case.',
    tags: ['manicure', 'grooming', 'stainless steel', 'gift set', 'practical'],
  },

  // ═══════════════════════════════════════════════════════
  // KEY CHAINS  (Key Chain → key-chain)
  //   BMW+ Performance → bmw-performance
  //   Benz → benz  |  Ferrari → ferrari  |  Tesla → tesla
  //   Holden → holden  |  Lemborgini → lemborgini
  // ═══════════════════════════════════════════════════════
  {
    slug: 'keychain-bmw', name: 'BMW Logo Premium Metal Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--bmw-performance',
    featured: false, sku: 'KC-BMW',
    short: 'Solid metal BMW logo keychain. For BMW enthusiasts.',
    desc: 'Premium die-cast zinc alloy keychain featuring the iconic BMW roundel in full colour. Chrome finish, reinforced stainless steel swivel ring. Presentation-boxed.',
    tags: ['keychain', 'BMW', 'car', 'gift', 'men'],
  },
  {
    slug: 'keychain-mercedes', name: 'Mercedes-Benz Premium Metal Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--benz',
    featured: false, sku: 'KC-MERC',
    short: 'Polished Mercedes three-star keychain.',
    desc: "Premium die-cast metal keychain with the iconic Mercedes-Benz three-pointed star. Chrome finish, reinforced swivel ring. Presentation-boxed.",
    tags: ['keychain', 'mercedes', 'car', 'gift', 'luxury'],
  },
  {
    slug: 'keychain-ferrari', name: 'Ferrari Prancing Horse Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--ferrari',
    featured: false, sku: 'KC-FERR',
    short: 'The prancing horse on your keys. For Ferrari dreamers.',
    desc: "The legendary Ferrari prancing horse on a premium metal keychain. Die-cast metal, enamel colour fill, chrome finish. Presentation-boxed.",
    tags: ['keychain', 'ferrari', 'prancing horse', 'car', 'gift'],
  },
  {
    slug: 'keychain-tesla', name: 'Tesla Premium Metal Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--tesla',
    featured: false, sku: 'KC-TESLA',
    short: 'Premium Tesla logo keychain for EV enthusiasts.',
    desc: 'A sleek premium metal keychain with the Tesla logo for the EV enthusiast. Die-cast construction, polished finish, stainless swivel ring. Presentation-boxed.',
    tags: ['keychain', 'tesla', 'electric', 'car', 'gift'],
  },
  {
    slug: 'keychain-holden', name: 'Holden Premium Metal Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--holden',
    featured: false, sku: 'KC-HLD',
    short: 'Iconic Holden lion keychain. A tribute to an Aussie legend.',
    desc: 'Pay tribute to the great Australian car brand. The iconic Holden lion on a premium die-cast metal keychain. Presentation-boxed.',
    tags: ['keychain', 'holden', 'australian', 'car', 'gift'],
  },
  {
    slug: 'keychain-lamborghini', name: 'Lamborghini Raging Bull Keychain',
    price: 14.95, cat: 'leather', imgKey: 'key-chain--lemborgini',
    featured: false, sku: 'KC-LAMBO',
    short: 'Lamborghini raging bull keychain. Pure automotive passion.',
    desc: "The iconic Lamborghini raging bull on a premium metal keychain. For the supercar enthusiast who appreciates Italian engineering at its most dramatic. Die-cast, enamel, chrome. Presentation-boxed.",
    tags: ['keychain', 'lamborghini', 'supercar', 'car', 'gift'],
  },
]

// ── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 AMAZORA — PRODUCT SETUP\n')

  console.log('Step 1: Flattening images from source...')
  flattenAll()

  console.log('\nStep 2: Creating categories...')
  const catMap: Record<string, string> = {}
  for (const c of CATS) {
    const r = await prisma.category.upsert({
      where:  { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder, image: c.image },
      create: c,
    })
    catMap[c.slug] = r.id
    console.log(`  ✓ ${c.name}`)
  }

  console.log('\nStep 3: Seeding products...')
  let n = 0; let failed = 0
  for (const p of PRODUCTS) {
    const comparePrice = displayPrice(p.price)
    let images = findImages(p.imgKey)

    // Fallback: try first 3 slug segments
    if (images.length === 0) {
      images = findImages(p.slug.split('-').slice(0, 3).join('-'))
    }

    try {
      await prisma.product.upsert({
        where:  { slug: p.slug },
        update: {
          price:        p.price,
          comparePrice,
          images:       images.length > 0 ? images : undefined,
          isFeatured:   !!p.featured,
          isActive:     true,
        },
        create: {
          slug:        p.slug,
          name:        p.name,
          shortDesc:   p.short,
          description: p.desc,
          price:       p.price,
          comparePrice,
          sku:         p.sku ?? p.slug.toUpperCase().slice(0, 12),
          images,
          categoryId:  catMap[p.cat]!,
          isFeatured:  !!p.featured,
          isActive:    true,
          stock:       50,
          tags:        p.tags,
        },
      })
      const imgNote = images.length > 0 ? `${images.length} img` : '⚠ no img'
      console.log(`  ✓ [${++n}] ${p.name}  A$${p.price} → A$${comparePrice}  (${imgNote})`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ [${++failed}] ${p.name}: ${msg.split('\n')[0]}`)
    }
  }

  console.log(`\n✅ Done — ${n} products seeded, ${failed} failed.`)
  await prisma.$disconnect()
}

main().catch(async e => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
