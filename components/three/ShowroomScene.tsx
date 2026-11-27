'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface ShowroomItem { slug: string; image: string }

/**
 * A ring of product panels in 3D space. Drag (or swipe) to spin it; it settles on the
 * nearest product and reports the front item through onFocus. Clicking the front panel
 * calls onOpen. Panels have rounded corners, a gold rim and a fading floor reflection.
 */
export default function ShowroomScene({
  items,
  onFocus,
  onOpen,
  className = '',
}: {
  items: ShowroomItem[]
  onFocus: (index: number) => void
  onOpen: (index: number) => void
  className?: string
}) {
  const mount = useRef<HTMLDivElement>(null)
  const focusRef = useRef(onFocus)
  const openRef = useRef(onOpen)
  focusRef.current = onFocus
  openRef.current = onOpen

  useEffect(() => {
    const el = mount.current
    if (!el || !items.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', touchAction: 'pan-y', cursor: 'grab' })

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog('#0B0A09', 9, 20)
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)

    const N = items.length
    const W = 2.2, H = 2.75
    const RADIUS = Math.max(4.6, (N * (W + 0.55)) / (2 * Math.PI))
    const step = (Math.PI * 2) / N

    const loader = new THREE.TextureLoader()
    const optimised = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`

    const panelGeo = new THREE.PlaneGeometry(W, H, 1, 1)
    const vertex = /* glsl */`
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
    const fragment = /* glsl */`
      uniform sampler2D uMap; uniform float uHasMap; uniform float uFocus; uniform float uReflect; uniform float uAspect;
      varying vec2 vUv;
      float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main(){
        vec2 uv = vUv;
        // cover-fit a 4:5 crop of the photo
        vec2 p = (uv - 0.5) * vec2(${(W / H).toFixed(4)}, 1.0);
        float d = rbox(p, vec2(${(W / H / 2).toFixed(4)}, 0.5), 0.06);
        if (d > 0.0) discard;
        vec2 tuv = vec2(0.5 + (uv.x - 0.5) * min(1.0, ${(W / H).toFixed(4)} / uAspect), 0.5 + (uv.y - 0.5) * min(1.0, uAspect / ${(W / H).toFixed(4)}));
        vec3 studio = mix(vec3(0.91, 0.886, 0.84), vec3(0.97, 0.953, 0.925), uv.y);
        vec3 col = uHasMap > 0.5 ? texture2D(uMap, tuv).rgb : studio;
        // gold rim
        float rim = smoothstep(-0.018, -0.004, d);
        vec3 gold = mix(vec3(0.72, 0.53, 0.17), vec3(0.98, 0.9, 0.63), uv.y);
        col = mix(col, gold, rim * (0.55 + 0.45 * uFocus));
        // dim panels that are not in front
        col *= mix(0.42, 1.0, uFocus);
        float alpha = 1.0;
        if (uReflect > 0.5) { alpha = (1.0 - smoothstep(0.0, 0.45, uv.y)) * 0.22; col *= 0.6; }
        gl_FragColor = vec4(col, alpha);
        #include <colorspace_fragment>
      }`

    const ring = new THREE.Group()
    scene.add(ring)
    const panels: { mesh: THREE.Mesh; refl: THREE.Mesh; mat: THREE.ShaderMaterial; rmat: THREE.ShaderMaterial }[] = []
    const textures: THREE.Texture[] = []

    items.forEach((it, i) => {
      const uniforms = { uMap: { value: null as THREE.Texture | null }, uHasMap: { value: 0 }, uFocus: { value: 0 }, uReflect: { value: 0 }, uAspect: { value: 0.8 } }
      const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, side: THREE.DoubleSide })
      const rmat = new THREE.ShaderMaterial({
        uniforms: { ...THREE.UniformsUtils.clone(uniforms), uReflect: { value: 1 } },
        vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, side: THREE.DoubleSide,
      })
      const a = i * step
      const mesh = new THREE.Mesh(panelGeo, mat)
      mesh.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS)
      mesh.rotation.y = a
      mesh.userData.index = i
      const refl = new THREE.Mesh(panelGeo, rmat)
      refl.position.set(mesh.position.x, -H - 0.08, mesh.position.z)
      refl.rotation.y = a
      refl.scale.y = -1
      ring.add(mesh, refl)
      panels.push({ mesh, refl, mat, rmat })

      loader.load(optimised(it.image), tex => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        textures.push(tex)
        const img = tex.image as HTMLImageElement
        const aspect = img && img.width ? img.width / img.height : 0.8
        for (const m of [mat, rmat]) { m.uniforms.uMap.value = tex; m.uniforms.uHasMap.value = 1; m.uniforms.uAspect.value = aspect }
      })
    })

    // ── Camera framing ───────────────────────────────────────────
    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      const narrow = w / h < 1.1
      camera.position.set(0, narrow ? 0.6 : 1.2, RADIUS + (narrow ? 8.6 : 7.4))
      camera.lookAt(0, -0.75, 0)
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // ── Spin physics ─────────────────────────────────────────────
    let angle = 0, target = 0, velocity = 0
    let dragging = false, lastX = 0, moved = 0, lastFocus = -1, idle = 0
    const canvas = renderer.domElement
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()

    const indexAt = (ang: number) => (((Math.round(-ang / step) % N) + N) % N)

    const onDown = (e: PointerEvent) => {
      dragging = true; lastX = e.clientX; moved = 0; velocity = 0
      canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'
    }
    const onMoveP = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX; moved += Math.abs(dx)
      const d = (dx / (el.clientWidth || 1)) * 3.2
      target += d; velocity = d
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false; canvas.style.cursor = 'grab'; idle = 0
      if (moved < 6) {
        // a click: open the panel under the pointer, or bring a side panel to the front
        const r = canvas.getBoundingClientRect()
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
        ray.setFromCamera(ndc, camera)
        const hit = ray.intersectObjects(panels.map(p => p.mesh))[0]
        if (hit) {
          const i = hit.object.userData.index as number
          if (i === indexAt(target)) openRef.current(i)
          else {
            let diff = -i * step - target
            diff = Math.atan2(Math.sin(diff), Math.cos(diff))
            target += diff
          }
        }
        return
      }
      target += velocity * 8
      target = Math.round(target / step) * step
    }
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMoveP, { passive: true })
    window.addEventListener('pointerup', onUp)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { target -= step; idle = 0 }
      if (e.key === 'ArrowLeft') { target += step; idle = 0 }
      if (e.key === 'Enter') openRef.current(indexAt(target))
    }
    el.addEventListener('keydown', onKey)

    // allow the HTML arrows to drive the ring
    const onNudge = (e: Event) => { target += ((e as CustomEvent<number>).detail ?? 0) * step; idle = 0 }
    el.addEventListener('showroom:nudge', onNudge)

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop() })
    io.observe(el)

    const timer = new THREE.Timer()
    timer.connect(document)
    let raf = 0
    const render = () => {
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05)
      idle += dt
      if (!dragging && !reduced && idle > 4) {
        // gentle auto-advance after 4s of no interaction
        target -= step; idle = 0
      }
      angle += (target - angle) * (dragging ? 0.35 : 0.075)
      ring.rotation.y = angle
      const t = timer.getElapsed()
      ring.position.y = Math.sin(t * 0.8) * 0.04

      for (let i = 0; i < N; i++) {
        let a = i * step + angle
        a = Math.atan2(Math.sin(a), Math.cos(a))
        const f = Math.max(0, 1 - Math.abs(a) / (step * 1.6))
        const { mesh, mat, rmat } = panels[i]
        mat.uniforms.uFocus.value += (f - mat.uniforms.uFocus.value) * 0.15
        rmat.uniforms.uFocus.value = mat.uniforms.uFocus.value
        const s = 1 + mat.uniforms.uFocus.value * 0.12
        mesh.scale.set(s, s, 1)
      }
      const fi = indexAt(target)
      if (fi !== lastFocus) { lastFocus = fi; focusRef.current(fi) }
      renderer.render(scene, camera)
    }
    const loop = () => {
      cancelAnimationFrame(raf)
      if (!visible || document.hidden) return
      render()
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      io.disconnect(); ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMoveP)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('keydown', onKey)
      el.removeEventListener('showroom:nudge', onNudge)
      panels.forEach(p => { p.mat.dispose(); p.rmat.dispose() })
      textures.forEach(t => t.dispose())
      panelGeo.dispose(); renderer.dispose(); canvas.remove()
    }
  }, [items])

  return <div ref={mount} className={className} tabIndex={0} aria-label="3D product showroom. Drag or use the arrow keys to browse; press Enter to open." />
}
