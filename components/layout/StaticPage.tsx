import Link from 'next/link'
import type { ReactNode } from 'react'

interface StaticPageProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export function StaticPage({ title, subtitle, children }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-navy text-white py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-brand-teal/70 hover:text-brand-teal text-sm mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-white/60 mt-3 text-base md:text-lg leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <div className="prose prose-brand max-w-none text-brand-navy prose-headings:font-display prose-headings:text-brand-navy prose-a:text-brand-red">
          {children}
        </div>
      </div>
    </div>
  )
}
