import type { Metadata } from 'next'
import { StaticPage } from '@/components/layout/StaticPage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Our Story',
  description: `${SITE.name} — Australia's premium gift marketplace. Curated marble chess sets, leather, humidors and iconic Australian gifts.`,
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: 'Our Story | Amazora Australia',
    description: 'Premium gifts curated for discerning Australians.',
  },
}

export default function AboutPage() {
  return (
    <StaticPage
      title="Our Story"
      subtitle="Premium gifts without the premium markup — built for Australians who value craftsmanship."
    >
      <p>
        {SITE.name} started with one belief: the gifts Australians give should feel as considered as the
        moments they celebrate. We hand-select marble chess sets, fine leather, humidors, ceramic decor
        and iconic pieces like Ned Kelly figurines — nothing makes the cut unless we would give it ourselves.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li><strong>Quality first</strong> — materials and finish you can see and feel</li>
        <li><strong>Fair pricing</strong> — direct sourcing, no inflated retail margins</li>
        <li><strong>Australian service</strong> — local support, fast AU-wide delivery</li>
      </ul>
      <h2>Based in Australia</h2>
      <p>
        We are a proudly Australian business. Free standard shipping on orders over A$99, GST included in
        all prices, and friendly support from our team at{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </StaticPage>
  )
}
