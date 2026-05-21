import type { Metadata } from 'next'
import { StaticPage } from '@/components/layout/StaticPage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for shopping at ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/terms` },
}

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Service" subtitle={`By using ${SITE.url} you agree to these terms.`}>
      <h2>Orders & payment</h2>
      <p>All prices are in AUD inclusive of GST. Payment is processed at checkout via Stripe. Orders are confirmed once payment succeeds.</p>
      <h2>Shipping & returns</h2>
      <p>See our <a href="/shipping">shipping</a> and <a href="/returns">returns</a> pages for full details.</p>
      <h2>Product descriptions</h2>
      <p>We aim for accuracy; natural materials (marble, leather) may vary slightly. Contact us before ordering if you need exact specifications.</p>
      <h2>Liability</h2>
      <p>Our liability is limited to the purchase price of the product, to the extent permitted by Australian Consumer Law.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${SITE.support}`}>{SITE.support}</a></p>
    </StaticPage>
  )
}
