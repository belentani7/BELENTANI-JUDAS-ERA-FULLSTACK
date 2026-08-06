import Lenis from 'lenis'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('belentani-signal', '0.65, 0, 0.2, 1')

type MotionContextValue = { motionEnabled: boolean; setMotionEnabled: (enabled: boolean) => void }
const MotionContext = createContext<MotionContextValue | null>(null)

export function MotionProvider({ children }: PropsWithChildren) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [motionEnabled, setMotionEnabled] = useState(!prefersReduced)

  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off'
    if (!motionEnabled) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [motionEnabled])

  const value = useMemo(() => ({ motionEnabled, setMotionEnabled }), [motionEnabled])
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}
export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used within MotionProvider')
  return context
}
