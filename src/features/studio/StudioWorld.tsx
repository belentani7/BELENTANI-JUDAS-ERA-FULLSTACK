import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useMotion } from '../../shell/MotionProvider'
import { NarrativeConstellation } from './NarrativeConstellation'
import { RitualHunt } from './RitualHunt'
import { StudioField } from './StudioField'
import { StudioWorkbench } from './StudioWorkbench'
import { useStudioMemory } from './useStudioMemory'

export function StudioWorld() {
  const root = useRef<HTMLDivElement>(null)
  const { motionEnabled } = useMotion()
  const memory = useStudioMemory()

  useEffect(() => {
    if (!root.current || !motionEnabled) return
    const context = gsap.context(() => {
      gsap.set('.studio-hero__word span, .studio-hero__copy > *', { willChange: 'transform, opacity' })
      gsap.fromTo(
        '.studio-hero__word span',
        { yPercent: 112, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.08, ease: 'belentani-signal', clearProps: 'willChange' },
      )
      gsap.fromTo(
        '.studio-hero__copy > *',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.32, stagger: 0.07, ease: 'belentani-signal', clearProps: 'willChange' },
      )
      gsap.utils.toArray<HTMLElement>('.studio-section-mark').forEach((mark) => {
        gsap.fromTo(mark, { opacity: 0, x: -24 }, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'belentani-signal',
          scrollTrigger: { trigger: mark, start: 'top 88%', once: true },
        })
      })
      gsap.to('.studio-hero__halo', {
        rotate: 42,
        scale: 1.08,
        ease: 'belentani-signal',
        scrollTrigger: { trigger: '.studio-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
    }, root)
    return () => context.revert()
  }, [motionEnabled])

  return (
    <div ref={root} className="studio-world" data-route-root>
      <section className="studio-hero" aria-labelledby="studio-title">
        <StudioField accent="#ff435d" intensity={8} motionEnabled={motionEnabled} />
        <div className="studio-hero__halo" aria-hidden="true"><i /><i /><i /></div>
        <div className="studio-hero__coordinates" aria-hidden="true">
          <span>BLN / CREATIVE OPERATING SYSTEM</span>
          <span>LOCAL-FIRST / 2026</span>
        </div>
        <div className="studio-hero__word" aria-hidden="true">
          <span><i>OMEGA</i></span>
          <span><i>STUDIO</i></span>
        </div>
        <div className="studio-hero__copy">
          <p>NOIACORE PRESENTA / ECOSISTEMA 01</p>
          <h1 id="studio-title">Un estudio completo dentro de un mundo vivo.</h1>
          <p>
            Cien instrumentos locales, siete cámaras narrativas, memoria voluntaria, juego y una obra sellada.
            La tecnología se declara; el misterio permanece.
          </p>
          <div>
            <a href="#studio-workbench">Entrar en el motor <ArrowDown size={17} /></a>
            <Link to="/portal">Cruzar al Portal <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <p className="studio-hero__truth">NO ES UNA NUBE DE 100 MODELOS / ES UN SISTEMA DE 100 CAPACIDADES EJECUTABLES SOBRE 10 MOTORES LOCALES</p>
      </section>

      <section className="studio-thesis" aria-labelledby="studio-thesis-title">
        <div className="studio-section-mark"><span>01</span><span>OPERATING PRINCIPLE</span></div>
        <p>UNA WEB DENTRO DE LA WEB</p>
        <h2 id="studio-thesis-title">No visitas BELENTANI. Lo operas.</h2>
        <div>
          <p>La entrada produce una semilla.</p>
          <p>La semilla altera imagen, ritmo, texto, código y espacio.</p>
          <p>La salida conserva origen, límites y posibilidad de retorno.</p>
        </div>
      </section>

      <NarrativeConstellation visited={memory.visited} onVisit={memory.visit} />
      <StudioWorkbench />
      <RitualHunt fragments={memory.fragments} zeroRoom={memory.zeroRoom} onCollect={memory.collect} onReset={memory.resetFragments} />

      <footer className="studio-end">
        <span>OMEGA / LOOP 01</span>
        <p>El ecosistema continúa en Atlas, Portal y JUDAS. El sello permanece intacto.</p>
        <nav aria-label="Continuar desde OMEGA Studio">
          <Link to="/atlas">ATLAS <ArrowUpRight size={16} /></Link>
          <Link to="/portal">PORTAL <ArrowUpRight size={16} /></Link>
          <Link to="/judas">JUDAS / SEALED <ArrowUpRight size={16} /></Link>
        </nav>
      </footer>
    </div>
  )
}
