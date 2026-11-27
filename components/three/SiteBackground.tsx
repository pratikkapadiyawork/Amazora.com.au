'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/**
 * One fixed WebGL canvas behind every page.
 *  • Liquid-gold "nebula": a domain-warped noise field rendered at low resolution into a
 *    render target (cheap), then upscaled as the scene background.
 *  • Floating cut-gold gems (one InstancedMesh, one draw call) and gold dust, laid out in a
 *    tall column the camera descends through as the page scrolls — so the background moves
 *    with the content on every page. Scroll speed spins the gems and stirs the gold.
 * Optimised: DPR capped, low-res shader pass, ~30fps when idle, paused when the tab is hidden,
 * a single still frame for reduced motion, and no canvas at all without WebGL.
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.setClearColor('#0B0A09', 1)
    el.appendChild(renderer.domElement)
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' })

    // ── 1. Liquid gold nebula (low-res pass) ─────────────────────
    const RT_SCALE = mobile ? 0.28 : 0.38
    const rt = new THREE.WebGLRenderTarget(4, 4, { depthBuffer: false })
    rt.texture.colorSpace = THREE.SRGBColorSpace
    const nebulaMat = new THREE.ShaderMaterial({
      depthTest: false, depthWrite: false,
      uniforms: {
        uTime: { value: 0 }, uScroll: { value: 0 }, uVel: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uAspect: { value: 1 },
      },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        uniform float uTime, uScroll, uVel, uAspect; uniform vec2 uMouse;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
        }
        float fbm(vec2 p){ float v = 0.0, a = 0.5; mat2 r = mat2(0.8,-0.6,0.6,0.8); for(int i=0;i<5;i++){ v += a*noise(p); p = r*p*2.02; a *= 0.5; } return v; }
        void main(){
          vec2 uv = vUv; uv.x *= uAspect;
          float t = uTime * 0.04;
          vec2 p = uv * 1.6 + vec2(0.0, uScroll * 1.8);
          vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
          vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + t*1.3 + uVel*0.6), fbm(p + 3.0*q + vec2(8.3, 2.8) - t));
          float f = fbm(p + 3.5*r);
          // gold veins where the warped field folds
          float vein = smoothstep(0.03, 0.0, abs(f - 0.55)) * 0.75 + smoothstep(0.11, 0.0, abs(f - 0.55)) * 0.16;
          vec3 onyx = vec3(0.028, 0.024, 0.02);
          vec3 umber = vec3(0.10, 0.066, 0.028);
          vec3 gold = vec3(0.95, 0.72, 0.32);
          vec3 col = mix(onyx, umber, smoothstep(0.25, 0.85, f) * 0.85);
          col += gold * vein * (0.35 + 0.25 * length(q));
          // Black Friday red ember, drifting with scroll
          float ember = smoothstep(0.75, 0.0, distance(vUv, vec2(0.85, fract(0.15 - uScroll * 0.35) )));
          col += vec3(0.5, 0.03, 0.05) * ember * 0.22;
          // soft light following the pointer
          col += gold * 0.06 * smoothstep(0.6, 0.0, distance(vUv, uMouse));
          // vignette
          col *= mix(0.55, 1.0, smoothstep(1.15, 0.25, distance(vUv, vec2(0.5))));
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), nebulaMat)
    const rtScene = new THREE.Scene(); rtScene.add(quad)
    const rtCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // ── 2. Main scene: gems + dust over the nebula ───────────────
    const scene = new THREE.Scene()
    scene.background = rt.texture
    const pmrem = new THREE.PMREMGenerator(renderer)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.fog = new THREE.FogExp2('#0B0A09', 0.028)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80)
    camera.position.set(0, 0, 12)

    const DEPTH = 60 // world units of "page" the camera travels through
    const GEMS = mobile ? 14 : 34
    const gemGeo = new THREE.OctahedronGeometry(0.5, 0)
    gemGeo.scale(1, 1.45, 1)
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: '#E2B857', metalness: 1, roughness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.1,
      envMapIntensity: 2.2, flatShading: true, emissive: '#3A2508', emissiveIntensity: 0.35,
    })
    const gems = new THREE.InstancedMesh(gemGeo, gemMat, GEMS)
    gems.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const gemData = Array.from({ length: GEMS }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1
      return {
        x: side * (3.2 + Math.random() * 5.5),
        y: 4 - (i / GEMS) * DEPTH + (Math.random() - 0.5) * 2,
        z: -2 - Math.random() * 9,
        s: 0.35 + Math.random() * 0.9,
        rx: Math.random() * Math.PI, ry: Math.random() * Math.PI,
        sp: 0.2 + Math.random() * 0.5,
        bob: Math.random() * Math.PI * 2,
      }
    })
    scene.add(gems)

    const DUST = mobile ? 350 : 900
    const dPos = new Float32Array(DUST * 3), dSeed = new Float32Array(DUST)
    for (let i = 0; i < DUST; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 22
      dPos[i * 3 + 1] = 6 - Math.random() * (DEPTH + 12)
      dPos[i * 3 + 2] = -1 - Math.random() * 12
      dSeed[i] = Math.random()
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 1))
    const dustMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uTime: { value: 0 }, uPx: { value: DPR }, uVel: { value: 0 } },
      vertexShader: /* glsl */`
        attribute float aSeed; uniform float uTime, uPx, uVel; varying float vA;
        void main(){
          vec3 p = position;
          p.x += sin(uTime*0.3 + aSeed*40.0) * 0.25;
          p.y += sin(uTime*0.2 + aSeed*20.0) * 0.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.2 + aSeed * 2.6) * uPx * (9.0 / -mv.z) * (1.0 + abs(uVel) * 1.5);
          vA = (0.3 + 0.7 * abs(sin(uTime * (0.5 + aSeed) + aSeed * 9.0))) * smoothstep(-16.0, -4.0, mv.z);
        }`,
      fragmentShader: /* glsl */`
        varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(1.0, 0.8, 0.42, smoothstep(0.5, 0.0, d) * vA * 0.7); }`,
    })
    scene.add(new THREE.Points(dustGeo, dustMat))

    const key = new THREE.DirectionalLight('#fff0cc', 3.2); key.position.set(4, 6, 8); scene.add(key)
    const red = new THREE.PointLight('#E11D2E', 30, 20); scene.add(red)

    // ── Sizing ───────────────────────────────────────────────────
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      renderer.setSize(w, h, false)
      rt.setSize(Math.max(2, Math.floor(w * RT_SCALE)), Math.max(2, Math.floor(h * RT_SCALE)))
      camera.aspect = w / h; camera.updateProjectionMatrix()
      nebulaMat.uniforms.uAspect.value = w / h
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Input ────────────────────────────────────────────────────
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    let lastInput = performance.now()
    const onMove = (e: PointerEvent) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = 1 - e.clientY / window.innerHeight; lastInput = performance.now() }
    window.addEventListener('pointermove', onMove, { passive: true })
    let scrollP = 0, scrollS = 0, lastY = window.scrollY, vel = 0
    const onScroll = () => { lastInput = performance.now() }
    window.addEventListener('scroll', onScroll, { passive: true })

    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), v = new THREE.Vector3(), sc = new THREE.Vector3()
    const timer = new THREE.Timer(); timer.connect(document)
    let raf = 0, frame = 0, spin = 0

    const render = () => {
      timer.update()
      const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed()
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const y = window.scrollY
      vel += ((y - lastY) / Math.max(dt, 0.001) / 4000 - vel) * 0.1
      lastY = y
      scrollP = y / max
      scrollS += (scrollP - scrollS) * 0.08
      spin += dt * (0.25 + Math.min(Math.abs(vel) * 6, 4))

      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04
      camera.position.x = (mouse.x - 0.5) * 1.2
      camera.position.y = -scrollS * DEPTH + (mouse.y - 0.5) * 0.8
      camera.lookAt(camera.position.x * 0.3, camera.position.y, 0)
      red.position.set(5 * Math.sin(t * 0.2), camera.position.y - 3, 2)

      for (let i = 0; i < GEMS; i++) {
        const g = gemData[i]
        e3.set(g.rx + spin * g.sp, g.ry + spin * g.sp * 1.3, 0)
        q.setFromEuler(e3)
        v.set(g.x, g.y + Math.sin(t * 0.6 + g.bob) * 0.25, g.z)
        sc.setScalar(g.s * (1 + Math.min(Math.abs(vel), 1) * 0.15))
        m.compose(v, q, sc)
        gems.setMatrixAt(i, m)
      }
      gems.instanceMatrix.needsUpdate = true

      nebulaMat.uniforms.uTime.value = t
      nebulaMat.uniforms.uScroll.value = scrollS
      nebulaMat.uniforms.uVel.value = vel
      nebulaMat.uniforms.uMouse.value.set(mouse.x, mouse.y)
      dustMat.uniforms.uTime.value = t
      dustMat.uniforms.uVel.value = vel

      renderer.setRenderTarget(rt); renderer.render(rtScene, rtCam)
      renderer.setRenderTarget(null); renderer.render(scene, camera)
    }

    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      frame++
      // idle for 2s → drop to ~30fps
      if (performance.now() - lastInput > 2000 && frame % 2) return
      render()
    }
    if (reduced) render()
    else loop()

    return () => {
      cancelAnimationFrame(raf)
      timer.dispose()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      gemGeo.dispose(); gemMat.dispose(); dustGeo.dispose(); dustMat.dispose()
      quad.geometry.dispose(); nebulaMat.dispose(); rt.dispose(); env.dispose(); pmrem.dispose()
      renderer.dispose(); renderer.domElement.remove()
    }
  }, [])

  return <div ref={mount} aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none" />
}
