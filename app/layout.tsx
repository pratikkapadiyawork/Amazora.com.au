import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  preload: true,
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://amazora.com.au'),
  title: {
    default:  'Amazora — Premium Gifts & Lifestyle | Australia',
    template: '%s | Amazora Australia',
  },
  description:
    'Discover curated premium gifts, marble chess sets, leather accessories, humidors, hip flasks and more. Free delivery across Australia on orders over A$99. Shop Amazora — Trusted by Australians.',
  keywords: [
    'premium gifts Australia', 'marble chess set Australia', 'luxury gifts online',
    'leather accessories Australia', 'humidor Australia', 'hip flask gift Australia',
    'ceramic decor Australia', 'premium gift sets', 'Australian gift shop',
    'amazora', 'amazora.com.au',
  ],
  authors: [{ name: 'Amazora', url: 'https://amazora.com.au' }],
  creator: 'Amazora Pty Ltd',
  publisher: 'Amazora Pty Ltd',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type:     'website',
    locale:   'en_AU',
    url:      'https://amazora.com.au',
    siteName: 'Amazora',
    title:    'Amazora — Premium Gifts & Lifestyle | Australia',
    description: 'Curated premium gifts. Free AU delivery. Trusted by Australians.',
    images: [{
      url:    'https://amazora.com.au/og-default.jpg',
      width:  1200,
      height: 630,
      alt:    'Amazora — Premium Gifts Australia',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Amazora — Premium Gifts Australia',
    description: 'Curated premium gifts. Free AU delivery.',
    images:      ['https://amazora.com.au/og-default.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-image-preview': 'large',
      'max-snippet':        -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://amazora.com.au',
    languages: { 'en-AU': 'https://amazora.com.au' },
  },
  manifest: '/manifest.json',
  icons: {
    icon:     '/favicon.ico',
    apple:    '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
}

export const viewport: Viewport = {
  themeColor:   '#0C0420',
  width:        'device-width',
  initialScale:  1,
  maximumScale:  5,
  userScalable:  true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en-AU"
        className={`${playfair.variable} ${jakarta.variable}`}
        suppressHydrationWarning
      >
        <body className="bg-brand-teal text-brand-navy antialiased">
          <Providers>
            {children}
          </Providers>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
