import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${SITE.name} — questions about orders, products or delivery across Australia.`,
  alternates: { canonical: `${SITE.url}/contact` },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
