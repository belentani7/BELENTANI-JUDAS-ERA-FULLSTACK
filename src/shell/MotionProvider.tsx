import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('belentani-signal', '0.65, 0, 0.2, 1')

type MotionContextValue = {
  motionEnabled: boolean
  setMotionEnabled: (enabled: boolean) => void
  setScrollLocked: (locked: boolean) => void
}
const MotionContext = createContext<MotionContextValue | null>(null)

export function MotionProvider({ children }: PropsWithChildren) {
  const media = useRef(window.matchMedia('(prefers-reduced-motion: reduce)'))
  const lenis = useRef<Lenis | null>(null)
  const scrollLocked = useRef(false)
  const [motionEnabled, setMotionEnabled] = useState(() => !media.current.matches)

  const setScrollLocked = useCallback((locked: boolean) => {
    scrollLocked.current = locked
    if (locked) lenis.current?.stop()
    else lenis.current?.start()
  }, [])

  useEffect(() => {
    const preference = media.current
    const updatePreference = (event: MediaQueryListEvent) => {
      if (event.matches) setMotionEnabled(false)
    }
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off'
    if (!motionEnabled) return
    const instance = new Lenis({ lerp: 0.09, smoothWheel: true })
    const update = (time: number) => instance.raf(time * 1000)
    lenis.current = instance
    if (scrollLocked.current) instance.stop()
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      instance.destroy()
      if (lenis.current === instance) lenis.current = null
    }
  }, [motionEnabled])

  const value = useMemo(
    () => ({ motionEnabled, setMotionEnabled, setScrollLocked }),
    [motionEnabled, setScrollLocked],
  )
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used within MotionProvider')
  return context
}
