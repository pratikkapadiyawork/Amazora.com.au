import type { Metadata } from 'next'
import { StaticPage } from '@/components/layout/StaticPage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: `30-day hassle-free returns on ${SITE.name}. How to return an item and receive a full refund.`,
  alternates: { canonical: `${SITE.url}/returns` },
}

export default function ReturnsPage() {
  return (
    <StaticPage
      title="30-Day Returns"
      subtitle="Not quite right? Return within 30 days for a full refund on unused items in original packaging."
    >
      <h2>Eligibility</h2>
      <ul>
        <li>Item unused and in original packaging</li>
        <li>Return initiated within 30 days of delivery</li>
        <li>Proof of purchase (order number or email)</li>
      </ul>
      <h2>How to return</h2>
      <ol>
        <li>Email <a href={`mailto:${SITE.support}`}>{SITE.support}</a> with your order number</li>
        <li>We send a prepaid return label (faulty/incorrect items) or return address</li>
        <li>Pack securely and post within 7 days of approval</li>
        <li>Refund processed within 5–7 business days of receipt</li>
      </ol>
      <h2>Exchanges</h2>
      <p>We can exchange for another variant or product of equal value. Contact us before sending your parcel.</p>
      <h2>Damaged on arrival</h2>
      <p>Photograph the packaging and item within 48 hours. We will replace or refund at no cost to you.</p>
    </StaticPage>
  )
}
