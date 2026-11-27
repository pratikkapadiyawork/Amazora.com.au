import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Display face: Cinzel — Roman inscriptional capitals, matching the logo wordmark
const display = localFont({
  variable: '--font-playfair',
  display: 'swap',
  src: [
    { path: './fonts/cinzel-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/cinzel-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/cinzel-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/cinzel-700.woff2', weight: '700', style: 'normal' },
  ],
})

const jakarta = localFont({
  variable: '--font-jakarta',
  display: 'swap',
  src: [
    { path: './fonts/jakarta-300.woff2', weight: '300', style: 'normal' },
    { path: './fonts/jakarta-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jakarta-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jakarta-600.woff2', weight: '600', style: 'normal' },
    { path: './fonts/jakarta-700.woff2', weight: '700', style: 'normal' },
    { path: './fonts/jakarta-800.woff2', weight: '800', style: 'normal' },
  ],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://amazora.com.au'),
  title: {
    default:  'Amazora — Premium Gifts Australia | Black Friday Sale',
    template: '%s | Amazora Australia',
  },
  description:
    'Discover curated premium gifts, marble chess sets, leather accessories, humidors, hip flasks and more. Free delivery across Australia on orders over A$99. Shop Amazora — Trusted by Australians.',
  keywords: [
    'amazora', 'amazora australia', 'amazora.com.au', 'amazora gifts', 'amazora shop',
    'premium gifts Australia', 'marble chess set Australia', 'luxury gifts online',
    'leather accessories Australia', 'humidor Australia', 'hip flask gift Australia',
    'ceramic decor Australia', 'premium gift sets', 'Australian gift shop',
    'unique australian gifts', 'gifts for him australia', 'gifts for her australia',
    'buy gifts online australia', 'ned kelly gift', 'ships models australia',
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
    title:    'Amazora Black Friday — Premium Gifts Australia',
    description: '20% off premium gifts this Black Friday. Free AU delivery over A$99.',
    images: [{
      url:    'https://amazora.com.au/og-default.jpg',
      width:  1200,
      height: 630,
      alt:    'Amazora Black Friday — Premium Gifts Australia',
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
    icon: [
      { url: '/brand/amazora-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple:    '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
}

export const viewport: Viewport = {
  themeColor:   '#0B0A09',
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
        className={`${display.variable} ${jakarta.variable}`}
        suppressHydrationWarning
      >
        <body className="bg-[#0B0A09] text-[#F4ECDC] antialiased">
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
