'use client'
import Image from 'next/image'
import { useState } from 'react'

interface SmartImageProps {
  src:              string
  alt:              string
  fill?:            boolean
  width?:           number
  height?:          number
  className?:       string
  sizes?:           string
  priority?:        boolean
  quality?:         number
  fallbackGradient?: string
}

export function SmartImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  quality = 75,
  fallbackGradient = 'from-brand-navy to-brand-steel',
}: SmartImageProps) {
  const [error, setError] = useState(false)

  const isBad = error || !src || src.includes('undefined') || src.includes('null')

  if (isBad) {
    return (
      <div
        className={`bg-gradient-to-br ${fallbackGradient} flex items-center justify-center ${fill ? 'absolute inset-0' : ''}`}
        style={!fill ? { width, height } : {}}
        aria-hidden="true"
      >
        <span className="text-white/20 text-4xl select-none">✦</span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        className={className}
        sizes={sizes ?? '100vw'}
        onError={() => setError(true)}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
    />
  )
}
