import Link from 'next/link'
import { SocialLinks }    from '@/components/shared/SocialLinks'
import { PaymentBadges }  from '@/components/shared/PaymentBadges'
import { CATEGORIES, SITE } from '@/lib/constants'
import { NewsletterForm } from './NewsletterForm'

const HELP_LINKS = [
  { href: '/shipping', label: 'Shipping Info'    },
  { href: '/returns',  label: '30-Day Returns'   },
  { href: '/contact',  label: 'Contact Us'       },
  { href: '/about',    label: 'Our Story'        },
  { href: '/blog',     label: 'Gift Guides'      },
]

const LEGAL_LINKS = [
  { href: '/privacy',     label: 'Privacy Policy'  },
  { href: '/terms',       label: 'Terms of Service' },
  { href: '/sitemap.xml', label: 'Sitemap'          },
]

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-brand-navy text-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Amazora homepage">
              <span className="font-display text-2xl font-bold">
                <span className="text-brand-red">A</span>mazora
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {SITE.tagline} Curated premium gifts delivered free across Australia.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/40 mb-6">
              <span>🇦🇺 Proudly Australian Business</span>
              <span>📦 Free shipping over A$99</span>
              <span>↩ 30-day hassle-free returns</span>
            </div>
            <SocialLinks />
          </div>

          {/* Column 2 — Shop */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">
              Shop
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  className="text-white/50 hover:text-brand-red text-sm transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  All Products
                </Link>
              </li>
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-white/50 hover:text-brand-red text-sm transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Help */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-5">
              Help
            </h3>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-brand-red text-sm transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-3">
              Stay in the loop
            </h3>
            <p className="text-white/45 text-sm mb-4">
              Exclusive offers and new arrivals in your inbox. No spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Payment badges */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <PaymentBadges variant="dark" showLabel={true} showSecurity={false} size="sm" />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs text-center md:text-left">
            © {new Date().getFullYear()} {SITE.name} Pty Ltd · All prices in AUD incl. GST
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/25 hover:text-white/50 text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
