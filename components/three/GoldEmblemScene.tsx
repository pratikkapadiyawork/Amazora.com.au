'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * Hero centerpiece: the Amazora octagon "A" emblem as a polished 3D gold medallion,
 * floating in a field of drifting gold dust. Follows the pointer, reacts to scroll,
 * pauses off-screen and renders a single still frame when reduced motion is on.
 */
export default function GoldEmblemScene({ className = '' }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // no WebGL — the CSS glow behind stays as the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    el.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0, 9)

    // ── Materials ────────────────────────────────────────────────
    const gold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E2B857'), metalness: 1, roughness: 0.2,
      clearcoat: 0.6, clearcoatRoughness: 0.15, envMapIntensity: 1.35,
    })
    const brushedGold = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C9962B'), metalness: 1, roughness: 0.38, envMapIntensity: 1.1,
    })
    const onyx = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0B0A09'), metalness: 0.2, roughness: 0.25,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.6,
    })
    const spark = new THREE.MeshBasicMaterial({ color: new THREE.Color('#FFF4D2') })

    // ── Emblem geometry (same proportions as the SVG logo) ───────
    const octagon = (r: number) => {
      const s = new THREE.Shape()
      for (let i = 0; i < 8; i++) {
        const a = THREE.MathUtils.degToRad(22.5 + 45 * i)
        const x = r * Math.cos(a), y = r * Math.sin(a)
        if (i === 0) s.moveTo(x, y); else s.lineTo(x, y)
      }
      s.closePath()
      return s
    }
    const R = 1.9
    const ring = octagon(R)
    ring.holes.push(octagon(R * 0.82) as unknown as THREE.Path)

    const emblem = new THREE.Group()
    const bevel = { bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 6, curveSegments: 1 }

    const ringMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(ring, { depth: 0.34, ...bevel }), gold)
    ringMesh.position.z = -0.17
    emblem.add(ringMesh)

    const disc = new THREE.Mesh(new THREE.ExtrudeGeometry(octagon(R * 0.83), { depth: 0.16, bevelEnabled: false }), onyx)
    disc.position.z = -0.12
    emblem.add(disc)

    // inner hairline ring
    const thin = octagon(R * 0.79)
    thin.holes.push(octagon(R * 0.765) as unknown as THREE.Path)
    const thinMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(thin, { depth: 0.05, bevelEnabled: false }), brushedGold)
    thinMesh.position.z = 0.04
    emblem.add(thinMesh)

    // The "A": two blades + chevron crossbar (units match the SVG, scaled)
    const u = (R / 50) * 1.0
    const poly = (pts: [number, number][]) => {
      const s = new THREE.Shape()
      pts.forEach(([x, y], i) => (i ? s.lineTo(x * u, -y * u) : s.moveTo(x * u, -y * u)))
      s.closePath()
      return s
    }
    const aShapes = [
      poly([[-26, 30], [-3, -33], [4, -33], [-14, 30]]),
      poly([[3, -22], [9, -33], [30, 30], [18, 30]]),
      poly([[-15, 10], [1, 2], [16, 10], [14, 16], [1, 9], [-12, 16]]),
    ]
    const letter = new THREE.Mesh(
      new THREE.ExtrudeGeometry(aShapes, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.025, bevelSegments: 4, curveSegments: 1 }),
      gold,
    )
    letter.position.z = 0.04
    emblem.add(letter)

    // four-point spark
    const sp = new THREE.Shape()
    const sx = 24 * u, sy = -(-26) * u, ss = 7 * u
    sp.moveTo(sx, sy + ss)
    sp.quadraticCurveTo(sx + ss * 0.18, sy + ss * 0.18, sx + ss, sy)
    sp.quadraticCurveTo(sx + ss * 0.18, sy - ss * 0.18, sx, sy - ss)
    sp.quadraticCurveTo(sx - ss * 0.18, sy - ss * 0.18, sx - ss, sy)
    sp.quadraticCurveTo(sx - ss * 0.18, sy + ss * 0.18, sx, sy + ss)
    const sparkMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(sp, { depth: 0.06, bevelEnabled: false }), spark)
    sparkMesh.position.z = 0.28
    emblem.add(sparkMesh)

    scene.add(emblem)

    // ── Lights (environment does most of the work) ───────────────
    const key = new THREE.DirectionalLight('#fff1d0', 2.2)
    key.position.set(3, 4, 6)
    scene.add(key)
    const rim = new THREE.PointLight('#E11D2E', 18, 12)
    rim.position.set(-3.5, -2, -2)
    scene.add(rim)
    const warm = new THREE.PointLight('#F3D27A', 10, 14)
    warm.position.set(3, -1, 3)
    scene.add(warm)

    // ── Gold dust ────────────────────────────────────────────────
    const COUNT = 1
    const pos = new Float32Array(COUNT * 3)
    const seed = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1
      seed[i] = Math.random()
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    const dustMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixel: { value: renderer.getPixelRatio() } },
      vertexShader: /* glsl */`
        attribute float aSeed; uniform float uTime; uniform float uPixel; varying float vA;
        void main(){
          vec3 p = position;
          p.y = mod(p.y + uTime * (0.08 + aSeed * 0.18) + 5.0, 10.0) - 5.0;
          p.x += sin(uTime * 0.4 + aSeed * 30.0) * 0.15;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aSeed * 3.2) * uPixel * (7.0 / -mv.z);
          vA = 0.35 + 0.65 * abs(sin(uTime * (0.6 + aSeed) + aSeed * 12.0));
        }`,
      fragmentShader: /* glsl */`
        varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vec3(1.0, 0.82, 0.45) * 1.2, a * vA * 0.75);
        }`,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    // the site-wide background already supplies gold dust; keep this scene to the emblem
    dust.visible = false

    // ── Size / input / visibility ────────────────────────────────
    // where the emblem sits: right half on wide screens, top centre on narrow ones
    const base = { x: 0, y: 0, s: 1 }
    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.z = 9
      const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 9 * camera.aspect
      if (w / h > 1.15) { base.x = Math.min(halfW * 0.46, 3.7); base.y = 0.05; base.s = 0.74 }
      else { base.x = 0; base.y = 1.7; base.s = Math.min(0.42, halfW * 0.27) }
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !reduced) loop() }, { threshold: 0 })
    io.observe(el)

    const timer = new THREE.Timer()
    timer.connect(document)
    let raf = 0
    let introT = 0
    const render = () => {
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05)
      const t = timer.getElapsed()
      introT = Math.min(1, introT + dt / 2.2)
      const ease = 1 - Math.pow(1 - introT, 4)

      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05
      const scroll = Math.min(1, window.scrollY / (window.innerHeight || 1))

      emblem.rotation.y = (1 - ease) * Math.PI * 2.2 + Math.sin(t * 0.5) * 0.35 + pointer.x * 0.45 + scroll * 1.4
      emblem.rotation.x = Math.sin(t * 0.35) * 0.08 + pointer.y * 0.25 - scroll * 0.3
      emblem.position.x = base.x
      emblem.position.y = base.y + Math.sin(t * 0.9) * 0.08 - scroll * 0.8
      const sc = (0.55 + 0.45 * ease) * base.s
      emblem.scale.setScalar(sc)
      sparkMesh.rotation.z = t * 0.8
      dust.rotation.y = pointer.x * 0.08
      dustMat.uniforms.uTime.value = t
      rim.intensity = 14 + Math.sin(t * 1.3) * 6
      renderer.render(scene, camera)
    }
    const loop = () => {
      cancelAnimationFrame(raf)
      if (!visible || document.hidden) return
      render()
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => { if (!document.hidden && !reduced) { loop() } }
    document.addEventListener('visibilitychange', onVis)

    if (reduced) { introT = 1; render() } else loop()

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      io.disconnect(); ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      scene.traverse(o => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
      })
      ;[gold, brushedGold, onyx, spark, dustMat].forEach(m => m.dispose())
      envTex.dispose(); pmrem.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} className={className} aria-hidden="true" />
}
