'use client'

import { useEffect, useRef } from 'react'
import { animate, createTimeline, onScroll, stagger, svg } from 'animejs'

const oct = (cx: number, cy: number, r: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + 45 * i) * Math.PI) / 180
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')

/**
 * Fixed SVG line-art layer (art-deco sunburst + nested octagons + a flowing gold ribbon)
 * that sits between the WebGL background and the content. anime.js draws the lines in on load,
 * then ties their rotation, scale and stroke drawing to the page scroll.
 */
export function VectorLayer() {
  const root = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lines = svg.createDrawable(el.querySelectorAll('.vl-draw'))
    const intro = createTimeline({ defaults: { ease: 'inOutQuart' } })
      .add(lines, { draw: ['0 0', '0 1'], duration: 2200, delay: stagger(25) })
      .add('.vl-oct', { opacity: [0, 1], duration: 900 }, '-=1600')

    const scrollOpts = (target: Element) => ({ target, enter: 'top top', leave: 'bottom bottom', sync: true })

    const body = document.body
    const spin = animate('.vl-octs', {
      rotate: [0, 135], scale: [1, 1.35], ease: 'linear',
      autoplay: onScroll(scrollOpts(body)),
    })
    const rays = animate('.vl-rays', {
      rotate: [-8, 8], scale: [1, 1.25], ease: 'linear',
      autoplay: onScroll(scrollOpts(body)),
    })
    const ribbon = svg.createDrawable(el.querySelectorAll('.vl-ribbon'))
    const ribbonAnim = animate(ribbon, {
      draw: ['0 0.25', '0.75 1'], ease: 'linear',
      autoplay: onScroll(scrollOpts(body)),
    })
    const breathe = animate('.vl-glow', {
      opacity: [0.25, 0.6], scale: [0.96, 1.04], duration: 4200,
      ease: 'inOutSine', loop: true, alternate: true,
    })

    return () => { intro.revert(); spin.revert(); rays.revert(); ribbonAnim.revert(); breathe.revert() }
  }, [])

  return (
    <svg
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-50"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="vl-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBE7A1" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#D9A93F" stopOpacity="0.55" />
          <stop offset="1" stopColor="#B8862B" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="vl-r" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E2B857" stopOpacity="0.16" />
          <stop offset="1" stopColor="#E2B857" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sunburst from below the fold */}
      <g className="vl-rays" style={{ transformOrigin: '720px 1150px', transformBox: 'view-box' }} opacity="0.16">
        {Array.from({ length: 36 }, (_, i) => {
          const a = Math.PI + (i / 35) * Math.PI
          return (
            <line key={i} className="vl-draw" x1={720} y1={1150} x2={720 + Math.cos(a) * 1500} y2={1150 + Math.sin(a) * 1500}
              stroke="url(#vl-g)" strokeWidth={i % 3 === 0 ? 1.2 : 0.6} vectorEffect="non-scaling-stroke" />
          )
        })}
      </g>

      {/* nested octagons echoing the emblem */}
      <circle className="vl-glow" cx="1180" cy="240" r="260" fill="url(#vl-r)" style={{ transformOrigin: '1180px 240px', transformBox: 'view-box' }} />
      <g className="vl-octs" style={{ transformOrigin: '1180px 240px', transformBox: 'view-box' }}>
        {[90, 140, 200, 270, 350].map((r, i) => (
          <polygon key={r} className="vl-draw vl-oct" points={oct(1180, 240, r)} fill="none"
            stroke="url(#vl-g)" strokeWidth={i === 2 ? 1.4 : 0.7} vectorEffect="non-scaling-stroke"
            strokeDasharray={i % 2 ? '2 10' : undefined} opacity={0.55 - i * 0.07} />
        ))}
      </g>

      {/* flowing gold ribbon */}
      <path className="vl-ribbon" fill="none" stroke="url(#vl-g)" strokeWidth="1.3" vectorEffect="non-scaling-stroke" opacity="0.6"
        d="M-60 620 C 220 420, 420 860, 720 640 S 1180 300, 1500 520" />
      <path className="vl-ribbon" fill="none" stroke="url(#vl-g)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" opacity="0.4"
        d="M-60 660 C 240 470, 430 900, 730 690 S 1190 350, 1500 570" />
    </svg>
  )
}
