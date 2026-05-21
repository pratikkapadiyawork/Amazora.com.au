import type { Metadata } from 'next'
import { StaticPage } from '@/components/layout/StaticPage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Shipping Information',
  description: `Free standard delivery across Australia on orders over A$99. Shipping rates, delivery times and carriers for ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/shipping` },
}

export default function ShippingPage() {
  return (
    <StaticPage
      title="Shipping Information"
      subtitle="Fast, tracked delivery anywhere in Australia. Free standard shipping on orders over A$99."
    >
      <h2>Delivery options</h2>
      <ul>
        <li><strong>Standard (5–8 business days)</strong> — A$9.99, or <strong>FREE</strong> over A$99</li>
        <li><strong>Express (2–3 business days)</strong> — A$14.99</li>
        <li><strong>Overnight (1 business day, metro)</strong> — A$24.99</li>
      </ul>
      <h2>Processing time</h2>
      <p>Orders are packed within 1–2 business days. You will receive a tracking email once dispatched via Australia Post or Startrack.</p>
      <h2>Remote & regional areas</h2>
      <p>Additional 2–4 days may apply for remote postcodes. PO boxes are accepted for standard parcels.</p>
      <h2>Questions?</h2>
      <p>Email <a href={`mailto:${SITE.support}`}>{SITE.support}</a> or visit our <a href="/contact">contact page</a>.</p>
    </StaticPage>
  )
}
