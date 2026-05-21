import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-brand-cream">
      <p className="text-brand-red font-bold text-sm uppercase tracking-widest mb-4">404</p>
      <h1 className="text-5xl md:text-6xl font-bold text-brand-navy mb-4 leading-tight">
        Page not found
      </h1>
      <p className="text-brand-muted text-lg mb-10 max-w-md">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="px-8 py-3 bg-brand-navy text-white rounded-xl font-semibold hover:bg-brand-navy/90 transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  )
}
