'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, X, Play } from 'lucide-react'

const VIDEO_SRC = '/Amazora.mp4'
const POSTER_SRC = '/images/australia_special.jpeg'
const AUDIO_KEY = 'amazora-story-audio'

export function BrandStoryMedia() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const savedTime  = useRef(0)
  const [inSection, setInSection]     = useState(false)
  const [popupMode, setPopupMode]     = useState(false)
  const [popupClosed, setPopupClosed] = useState(false)
  const [audioOn, setAudioOn]         = useState(false)
  const [ready, setReady]             = useState(false)

  const isFloating = popupMode && !popupClosed

  const playVideo = useCallback(async (withSound: boolean) => {
    const v = videoRef.current
    if (!v) return
    v.muted = !withSound
    try {
      await v.play()
    } catch {
      /* autoplay policy */
    }
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const resume = () => {
      if (savedTime.current > 0) v.currentTime = savedTime.current
      void playVideo(audioOn)
    }
    const id = requestAnimationFrame(resume)
    return () => {
      cancelAnimationFrame(id)
      if (videoRef.current) savedTime.current = videoRef.current.currentTime
    }
  }, [isFloating, audioOn, playVideo])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setAudioOn(sessionStorage.getItem(AUDIO_KEY) === '1')
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio
        const visible = ratio >= 0.28
        setInSection(visible)
        if (visible) {
          setPopupMode(false)
          void playVideo(audioOn)
        } else if (ratio < 0.08 && ready && !popupClosed) {
          setPopupMode(true)
          void playVideo(audioOn)
        }
      },
      { threshold: [0, 0.08, 0.28, 0.5] },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [audioOn, playVideo, ready, popupClosed])

  const enableAudio = async () => {
    setAudioOn(true)
    sessionStorage.setItem(AUDIO_KEY, '1')
    const v = videoRef.current
    if (v) {
      v.muted = false
      await playVideo(true)
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    if (v.muted) void enableAudio()
    else {
      v.muted = true
      setAudioOn(false)
      sessionStorage.removeItem(AUDIO_KEY)
    }
  }

  const closePopup = () => {
    setPopupClosed(true)
    setPopupMode(false)
    videoRef.current?.pause()
  }

  const reopenPopup = () => {
    setPopupClosed(false)
    setPopupMode(true)
    void playVideo(audioOn)
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="our-story"
        style={{ background: '#1d3557' }}
        className="py-16 md:py-24 overflow-hidden scroll-mt-20"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span
                className="font-body text-[11px] font-bold tracking-[0.22em] uppercase block mb-4"
                style={{ color: '#a8dadc' }}
              >
                Our Story
              </span>
              <h2
                className="font-display mb-6"
                style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', color: '#f1faee', lineHeight: 1.08 }}
              >
                Built in Australia.
                <br />
                <span style={{ color: '#e63946', fontStyle: 'italic' }}>Loud</span> about quality.
                <br />
                Quiet on markup.
              </h2>
              <p
                className="font-body mb-4 leading-relaxed"
                style={{ color: 'rgba(241,250,238,0.82)', fontSize: '1.05rem' }}
              >
                Amazora is the home for premium gifts Australians actually want — marble chess,
                leather classics, humidors, hip flasks, and pieces you will not find in a generic
                department store.
              </p>
              <p
                className="font-body mb-8 leading-relaxed"
                style={{ color: 'rgba(168,218,220,0.65)', fontSize: '0.95rem' }}
              >
                Search <strong className="text-[#a8dadc]">Amazora</strong> for curated craftsmanship,
                fast delivery, and a brand that stands behind every order.
              </p>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-12 px-8 rounded-xl font-body font-semibold text-sm"
                  style={{
                    background: '#e63946',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(230,57,70,0.45)',
                  }}
                >
                  Our Story →
                </motion.button>
              </Link>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="relative aspect-[4/3] lg:aspect-[5/4] rounded-[28px] overflow-hidden"
                style={{
                  visibility: isFloating ? 'hidden' : 'visible',
                  boxShadow: isFloating ? undefined : '0 20px 60px rgba(0,0,0,0.45)',
                  border: isFloating ? undefined : '1px solid rgba(168,218,220,0.18)',
                }}
                aria-hidden={isFloating}
              >
                {!isFloating && (
                  <>
                    <video
                      ref={videoRef}
                      src={VIDEO_SRC}
                      poster={POSTER_SRC}
                      playsInline
                      loop
                      muted={!audioOn}
                      preload="metadata"
                      onLoadedData={() => setReady(true)}
                      className="absolute inset-0 h-full w-full object-cover"
                      aria-label="Amazora brand story video"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(180deg, transparent 50%, rgba(13,25,41,0.75) 100%)',
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-colors"
                        aria-label={audioOn ? 'Mute video' : 'Unmute video'}
                      >
                        {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </button>
                    </div>
                    {!audioOn && inSection && (
                      <button
                        type="button"
                        onClick={() => void enableAudio()}
                        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-full font-body text-xs font-bold tracking-wide uppercase backdrop-blur-md border border-white/25 text-white hover:bg-white/10 transition-colors"
                      >
                        Tap for sound
                      </button>
                    )}
                  </>
                )}
              </motion.div>

              {isFloating && (
                <div className="absolute inset-0 rounded-[28px] overflow-hidden">
                  <Image
                    src={POSTER_SRC}
                    alt="Premium Australian gifts from Amazora"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -bottom-3 -left-3 rounded-2xl p-4 z-10"
                style={{
                  background: 'rgba(29,53,87,0.94)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(168,218,220,0.2)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={POSTER_SRC} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-body font-bold text-sm" style={{ color: '#f1faee' }}>
                      Australian Business
                    </p>
                    <p className="font-body text-xs" style={{ color: 'rgba(168,218,220,0.65)' }}>
                      Free shipping over A$99 · amazora.com.au
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {isFloating && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed z-[240] rounded-2xl overflow-hidden shadow-2xl border border-white/15"
          style={{
            bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
            right: 'max(1rem, env(safe-area-inset-right, 0px))',
            width: 'min(92vw, 300px)',
            aspectRatio: '16/10',
            background: '#152641',
          }}
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            playsInline
            loop
            muted={!audioOn}
            preload="metadata"
            onLoadedData={() => setReady(true)}
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="Amazora brand story video"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 50%, rgba(13,25,41,0.75) 100%)',
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <button
              type="button"
              onClick={toggleMute}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-colors"
              aria-label={audioOn ? 'Mute video' : 'Unmute video'}
            >
              {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              type="button"
              onClick={closePopup}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-colors"
              aria-label="Close video"
            >
              <X size={16} />
            </button>
          </div>
          <p className="absolute bottom-2 left-3 font-body text-[10px] font-semibold text-white/70 z-10">
            Amazora story
          </p>
        </motion.div>
      )}

      {popupClosed && !inSection && ready && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={reopenPopup}
          className="fixed z-[239] flex items-center justify-center gap-2 px-4 h-11 rounded-full text-white text-xs font-bold shadow-lg border border-white/20"
          style={{
            background: '#e63946',
            bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
            right: '1rem',
          }}
          aria-label="Play Amazora story video"
        >
          <Play size={14} fill="currentColor" />
          Watch story
        </motion.button>
      )}
    </>
  )
}
