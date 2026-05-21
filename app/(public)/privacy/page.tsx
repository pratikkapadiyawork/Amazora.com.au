import type { Metadata } from 'next'
import { StaticPage } from '@/components/layout/StaticPage'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.name} collects, uses and protects your personal information.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE.url}/privacy` },
}

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" subtitle={`Last updated: May 2026 · ${SITE.name} Pty Ltd`}>
      <p>We respect your privacy and comply with the Australian Privacy Act 1988.</p>
      <h2>Information we collect</h2>
      <p>Name, email, phone, shipping address, order history, and payment details (processed securely by Stripe — we never store card numbers).</p>
      <h2>How we use it</h2>
      <p>To fulfil orders, provide support, send transactional emails, and improve our store. Marketing emails only with your consent.</p>
      <h2>Third parties</h2>
      <p>Stripe (payments), Resend (email), Vercel (hosting), Clerk (account sign-in), and Neon (database). Each operates under their own privacy policies.</p>
      <h2>Your rights</h2>
      <p>Request access, correction or deletion of your data by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
    </StaticPage>
  )
}
