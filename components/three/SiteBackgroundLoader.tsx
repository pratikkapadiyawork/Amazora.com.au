'use client'

import dynamic from 'next/dynamic'

// Client-only, lazy: the WebGL background never blocks first paint.
const SiteBackground = dynamic(() => import('@/components/three/SiteBackground'), { ssr: false })

export function SiteBackgroundLoader() {
  return <SiteBackground />
}
