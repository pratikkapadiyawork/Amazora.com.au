'use client'
import { useEffect, useState } from 'react'

export function useCountdown(target: string) {
  const end = new Date(target).getTime()
  const calc = () => Math.max(0, end - Date.now())
  const [left, setLeft] = useState<number | null>(null)

  useEffect(() => {
    setLeft(calc())
    const t = setInterval(() => setLeft(calc()), 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end])

  const ms = left ?? 0
  return {
    ready:   left !== null,
    done:    left !== null && ms <= 0,
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
