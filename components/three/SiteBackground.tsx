'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Site-wide WebGL background, drawn in a gold "vector" style:
 *  • Contour field — animated topographic gold isolines (shader, rendered at reduced resolution).
 *  • Octagon tunnel — gold line-art octagons (the logo's shape) joined by rails; scrolling the page
 *    flies the camera forward through it. Scroll speed adds warp and streaks.
 *  • Wireframe gems + gold dust drifting around the tunnel.
 * Everything is lines/points (no lighting), so it stays light. DPR capped, ~30fps when idle,
 * paused when the tab is hidden, single still frame for reduced motion.
 */
export default function SiteBackground() {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: 'high-performance' })
    } catch {
      return
    }
    const DPR = Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5)
    renderer.setPixelRatio(DPR)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor('#0B0A09', 1)
    el.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

    // ── Contour field (low-res pass) ─────────────────────────────
    const RT_SCALE = mobile ? 0.5 : 0.62
    const rt = new THREE.WebGLRenderTarget(4, 4, { depthBuffer: false })
    rt.texture.colorSpace = THREE.SRGBColorSpace
    const contourMat = new THREE.ShaderMaterial({
      depthTest: false, depthWrite: false,
      uniforms: {
        uTime: { value: 0 }, uScroll: { value: 0 }, uVel: { value: 0 }, uAspect: { value: 1 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        uniform float uTime, uScroll, uVel, uAspect; uniform vec2 uMouse;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
        float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<4;i++){ v += a*noise(p); p = p*2.03 + 17.0; a *= 0.5; } return v; }
        void main(){
          vec2 uv = vUv; uv.x *= uAspect;
          float t = uTime * 0.035;
          vec2 p = uv * 1.25 + vec2(t * 0.6, uScroll * 2.2 + t * 0.3);
          float lift = smoothstep(0.45, 0.0, distance(vUv, uMouse)) * 0.12;
          float h = fbm(p + vec2(fbm(p + t), fbm(p - t)) * 0.6) + lift + uVel * 0.08;
          float bands = h * 18.0;
          float w = fwidth(bands);
          float d1 = abs(fract(bands - 0.5) - 0.5);              // distance to nearest contour
          float d5 = abs(fract(bands / 5.0 - 0.5) - 0.5) * 5.0;  // distance to nearest major contour
          float line = 1.0 - smoothstep(0.0, w * 1.2, d1);
          float major = 1.0 - smoothstep(0.0, w * 1.8, d5);
          vec3 base = mix(vec3(0.022, 0.019, 0.016), vec3(0.05, 0.037, 0.02), smoothstep(0.25, 0.8, h));
          vec3 gold = vec3(0.86, 0.66, 0.3);
          vec3 col = base + gold * (line * 0.22 + major * 0.5) * (0.55 + 0.45 * smoothstep(0.2, 0.9, h));
          col += vec3(0.45, 0.03, 0.05) * 0.18 * smoothstep(0.7, 0.0, distance(vUv, vec2(0.12, fract(0.85 + uScroll * 0.4))));
          col *= mix(0.6, 1.0, smoothstep(1.2, 0.3, distance(vUv, vec2(0.5))));
          // colours above are authored in sRGB; store linear so the output transform maps them back exactly
          gl_FragColor = vec4(pow(col, vec3(2.2)), 1.0);
        }`,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), contourMat)
    const rtScene = new THREE.Scene(); rtScene.add(quad)
    const rtCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // ── Main scene ───────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = rt.texture
    scene.fog = new THREE.Fog('#0B0A09', 6, 34)
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 80)

    const RINGS = mobile ? 18 : 28
    const GAP = 4.2
    const DEPTH = RINGS * GAP
    const R = 7

    // octagon rings + rails in a single LineSegments geometry (one draw call)
    const segs: number[] = []
    const octPt = (i: number, r: number, z: number) => {
      const a = THREE.MathUtils.degToRad(22.5 + 45 * i)
      return [Math.cos(a) * r, Math.sin(a) * r, z]
    }
    for (let k = 0; k < RINGS; k++) {
      const z = -k * GAP
      const r = k % 3 === 0 ? R : R * 0.94
      const rNext = (k + 1) % 3 === 0 ? R : R * 0.94
      for (let i = 0; i < 8; i++) {
        segs.push(...octPt(i, r, z), ...octPt(i + 1, r, z))
        if (k % 3 === 0) segs.push(...octPt(i, r * 0.88, z), ...octPt(i + 1, r * 0.88, z))
        if (k < RINGS - 1) segs.push(...octPt(i, r, z), ...octPt(i, rNext, z - GAP))
      }
    }
    const tunnelGeo = new THREE.BufferGeometry()
    tunnelGeo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3))
    const tunnelMat = new THREE.LineBasicMaterial({ color: '#D9A93F', transparent: true, opacity: 0.42, fog: true })
    const tunnel = new THREE.LineSegments(tunnelGeo, tunnelMat)
    scene.add(tunnel)

    // wireframe gems
    const gemEdges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.7, 0))
    const gemMat = new THREE.LineBasicMaterial({ color: '#F3D27A', transparent: true, opacity: 0.75, fog: true })
    const GEMS = mobile ? 8 : 16
    const gems = Array.from({ length: GEMS }, (_, i) => {
      const g = new THREE.LineSegments(gemEdges, gemMat)
      const a = Math.random() * Math.PI * 2
      const rr = 2.8 + Math.random() * 3.2
      g.position.set(Math.cos(a) * rr, Math.sin(a) * rr, -2 - (i / GEMS) * DEPTH)
      g.scale.setScalar(0.5 + Math.random() * 1.1)
      g.userData = { sp: 0.2 + Math.random() * 0.6, bob: Math.random() * 6, y0: g.position.y }
      scene.add(g)
      return g
    })

    // gold dust
    const DUST = mobile ? 400 : 1000
    const dPos = new Float32Array(DUST * 3), dSeed = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      const a = Math.random() * Math.PI * 2, r = 1 + Math.random() * 6.5
      dPos[i * 3] = Math.cos(a) * r; dPos[i * 3 + 1] = Math.sin(a) * r; dPos[i * 3 + 2] = 6 - Math.random() * (DEPTH + 10)
      dSeed[i] = Math.random()
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 1))
    const dustMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: DPR }, uVel: { value: 0 } },
      vertexShader: /* glsl */`
        attribute float aSeed; uniform float uTime, uPx, uVel; varying float vA;
        void main(){
          vec3 p = position;
          p.xy += vec2(sin(uTime*0.3 + aSeed*40.0), cos(uTime*0.25 + aSeed*30.0)) * 0.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.0 + aSeed * 2.4) * uPx * (10.0 / -mv.z) * (1.0 + min(abs(uVel) * 3.0, 3.0));
          vA = (0.35 + 0.65 * abs(sin(uTime * (0.4 + aSeed) + aSeed * 9.0))) * smoothstep(-34.0, -3.0, mv.z) * smoothstep(-0.5, -2.5, mv.z);
        }`,
      fragmentShader: /* glsl */`
        varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.82, 0.45, smoothstep(0.5, 0.0, d) * vA * 0.75); }`,
    })
    scene.add(new THREE.Points(dustGeo, dustMat))

    // ── Size / input ─────────────────────────────────────────────
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      rt.setSize(Math.max(2, Math.floor(w * RT_SCALE * DPR)), Math.max(2, Math.floor(h * RT_SCALE * DPR)))
      camera.aspect = w / h; camera.updateProjectionMatrix()
      contourMat.uniforms.uAspect.value = w / h
    }
    resize()
    window.addEventListener('resize', resize)

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let lastInput = performance.now()
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = 1 - e.clientY / window.innerHeight; lastInput = performance.now() }
    const onScroll = () => { lastInput = performance.now() }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    const timer = new THREE.Timer(); timer.connect(document)
    let raf = 0, frame = 0, scrollS = 0, vel = 0, lastY = window.scrollY, roll = 0, fov = 60

    const render = () => {
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed()
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const y = window.scrollY
      vel += ((y - lastY) / Math.max(dt, 0.001) / 3000 - vel) * 0.12
      lastY = y
      scrollS += (y / max - scrollS) * 0.09
      mouse.x += (mouse.tx - mouse.x) * 0.05; mouse.y += (mouse.ty - mouse.y) * 0.05

      camera.position.set((mouse.x - 0.5) * 1.6, (mouse.y - 0.5) * 1.1, 6 - scrollS * (DEPTH - 14))
      roll += (Math.sin(t * 0.15) * 0.05 + vel * 0.25 - roll) * 0.05
      camera.rotation.set(0, 0, roll)
      const targetFov = 60 + Math.min(Math.abs(vel) * 18, 14)
      if (Math.abs(targetFov - fov) > 0.01) { fov += (targetFov - fov) * 0.1; camera.fov = fov; camera.updateProjectionMatrix() }

      tunnel.rotation.z = t * 0.03 + scrollS * 1.2
      tunnelMat.opacity = 0.28 + Math.min(Math.abs(vel) * 0.6, 0.3)
      for (const g of gems) {
        g.rotation.x += dt * g.userData.sp * (1 + Math.abs(vel) * 4)
        g.rotation.y += dt * g.userData.sp * 0.7
        g.position.y = g.userData.y0 + Math.sin(t * 0.6 + g.userData.bob) * 0.3
      }

      contourMat.uniforms.uTime.value = t
      contourMat.uniforms.uScroll.value = scrollS
      contourMat.uniforms.uVel.value = vel
      contourMat.uniforms.uMouse.value.set(mouse.x, mouse.y)
      dustMat.uniforms.uTime.value = t
      dustMat.uniforms.uVel.value = vel

      renderer.setRenderTarget(rt); renderer.render(rtScene, rtCam)
      renderer.setRenderTarget(null); renderer.render(scene, camera)
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      frame++
      if (performance.now() - lastInput > 2500 && frame % 2) return // ~30fps when idle
      render()
    }
    if (reduced) render(); else loop()

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      tunnelGeo.dispose(); tunnelMat.dispose(); gemEdges.dispose(); gemMat.dispose()
      dustGeo.dispose(); dustMat.dispose(); quad.geometry.dispose(); contourMat.dispose(); rt.dispose()
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />
}
