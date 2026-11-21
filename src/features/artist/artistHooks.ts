import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useArtistMotion(root: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (!root.current || !enabled) return
    const context = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>('.artist-stage')
      stages.forEach((stage) => {
        const content = stage.querySelector('.artist-stage__content')
        const scene = stage.querySelector('.artist-stage__scene')
        if (content) {
          gsap.fromTo(content, { opacity: 0.55, y: 56 }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'belentani-signal',
            scrollTrigger: { trigger: stage, start: 'top 78%', end: 'top 34%', scrub: 0.7 },
          })
        }
        if (scene) {
          gsap.fromTo(scene, { clipPath: 'inset(10% 8% 10% 8%)', scale: 0.95 }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 0.8,
            ease: 'belentani-signal',
            scrollTrigger: { trigger: stage, start: 'top 84%', end: 'center 48%', scrub: 0.8 },
          })
        }
      })
    }, root)
    return () => context.revert()
  }, [enabled, root])
}
