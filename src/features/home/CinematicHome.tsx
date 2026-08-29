import { startTransition, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useMotion } from '../../shell/MotionProvider'
import { HomeArtifactScene } from './HomeArtifactScene'
import { getHomeDirection, HOME_LAB_QUERY, homeDirections } from './homeDirections'
import type { QuintessencePhase } from './QuintessenceWorld'

const phaseCopy: Record<QuintessencePhase, { label: string; statement: string }> = {
  dormancy: { label: 'Dormancia', statement: 'Cinco materias esperan bajo la superficie.' },
  memory: { label: 'Memoria', statement: 'La materia reconoce que alguna vez fue una.' },
  convergence: { label: 'Convergencia', statement: 'Cinco campos obedecen a una misma gravedad.' },
  shockwave: { label: 'Shockwave', statement: 'La forma rompe su límite sin perder su memoria.' },
  threshold: { label: 'Umbral', statement: 'Lo que parecía fragmento era umbral.' },
}

const gatheredPhases: readonly QuintessencePhase[] = ['convergence', 'shockwave', 'threshold']

export function CinematicHome() {
  const root = useRef<HTMLElement>(null)
  const [maximumIllumination, setMaximumIllumination] = useState(false)
  const [phase, setPhase] = useState<QuintessencePhase>('dormancy')
  const [searchParams, setSearchParams] = useSearchParams()
  const { motionEnabled } = useMotion()
  const laboratory = searchParams.get('lab') === HOME_LAB_QUERY
  const direction = getHomeDirection(searchParams.get('direction'), laboratory)
  const isQuintessence = direction.id === 'quintessence'
  const gathered = isQuintessence && gatheredPhases.includes(phase)

  useEffect(() => {
    if (!root.current || !motionEnabled) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.cinematic-home__title span',
        { yPercent: 115, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.08, ease: 'belentani-signal' },
      )
      gsap.fromTo(
        '.cinematic-home__statement, .cinematic-home__actions',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.09, delay: 0.28, ease: 'belentani-signal' },
      )
    }, root)
    return () => context.revert()
  }, [direction.id, motionEnabled])

  useEffect(() => {
    if (!root.current || !motionEnabled || !isQuintessence) return
    const context = gsap.context(() => {
      const entity = '.cinematic-home__entity'
      if (phase === 'memory') {
        gsap.to(entity, { filter: 'brightness(1.08)', duration: 0.8, ease: 'belentani-signal' })
      }
      if (phase === 'convergence') {
        gsap.fromTo(entity, { scale: 1 }, { scale: 1.025, duration: 1.15, ease: 'belentani-signal' })
      }
      if (phase === 'shockwave') {
        gsap.fromTo(entity, { filter: 'brightness(1.4)' }, { filter: 'brightness(1)', duration: 0.86, ease: 'belentani-signal' })
      }
      if (phase === 'threshold') {
        gsap.to(entity, { scale: 1, filter: 'brightness(1.12)', duration: 0.9, ease: 'belentani-signal' })
      }
    }, root)
    return () => context.revert()
  }, [isQuintessence, motionEnabled, phase])

  useEffect(() => {
    setMaximumIllumination(false)
    setPhase('dormancy')
    if (direction.id !== 'portal' || !motionEnabled) return
    const timeout = window.setTimeout(() => setMaximumIllumination(true), 9000)
    return () => window.clearTimeout(timeout)
  }, [direction.id, motionEnabled])

  useEffect(() => {
    if (!isQuintessence || !motionEnabled) return
    if (phase === 'convergence') {
      const shockwave = window.setTimeout(() => setPhase('shockwave'), 1050)
      return () => window.clearTimeout(shockwave)
    }
    if (phase === 'shockwave') {
      const threshold = window.setTimeout(() => setPhase('threshold'), 850)
      return () => window.clearTimeout(threshold)
    }
  }, [isQuintessence, motionEnabled, phase])

  const remember = () => {
    if (isQuintessence && phase === 'dormancy') startTransition(() => setPhase('memory'))
  }

  const gather = () => {
    if (!isQuintessence || gathered) return
    setPhase(motionEnabled ? 'convergence' : 'threshold')
  }

  const disperse = () => {
    if (!isQuintessence || phase === 'dormancy') return
    setPhase('dormancy')
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    remember()
    if (!root.current || !motionEnabled || event.pointerType === 'touch') return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    root.current.style.setProperty('--pointer-x', x.toFixed(3))
    root.current.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const selectLaboratoryDirection = (id: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('lab', HOME_LAB_QUERY)
    next.set('direction', id)
    setSearchParams(next, { replace: true })
  }

  const currentCopy = isQuintessence ? phaseCopy[phase] : { label: direction.label, statement: direction.statement }

  return (
    <section
      ref={root}
      className="cinematic-home"
      data-direction={direction.id}
      data-experience-state={isQuintessence ? phase : undefined}
      data-illuminated={maximumIllumination || undefined}
      data-gathered={gathered || undefined}
      data-laboratory={laboratory || undefined}
      style={{ '--home-accent': direction.accent } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerDown={remember}
      onFocusCapture={remember}
      aria-labelledby="cinematic-home-title"
      aria-describedby="cinematic-home-statement"
      data-route-root
    >
      <figure className="cinematic-home__entity" data-state={isQuintessence ? phase : undefined}>
        <div className="cinematic-home__media" aria-hidden="true">
          {direction.image && (
            <img
              key={direction.id}
              src={direction.image}
              alt=""
              style={{ objectPosition: direction.objectPosition }}
            />
          )}
          <div className="cinematic-home__grade" />
          <HomeArtifactScene
            direction={direction.id}
            accent={direction.accent}
            motionEnabled={motionEnabled}
            maximumIllumination={maximumIllumination}
            quintessencePhase={phase}
          />
        </div>
        <figcaption className="sr-only">
          Entidad heroica de quinta materia: cinco fragmentos despiertan, recuerdan y convergen hasta abrir un umbral vivo.
        </figcaption>
      </figure>

      <header className="cinematic-home__header">
        <p className="cinematic-home__edition">WEB EXPERIENCE / 2026</p>
        <p className="cinematic-home__coordinates">41.3874° N<br />2.1686° E</p>
        <h1 id="cinematic-home-title" className="cinematic-home__title" aria-label="BELENTANI">
          {direction.title.map((line) => (
            <span key={line}><i>{line}</i></span>
          ))}
        </h1>
      </header>

      <div id="cinematic-home-statement" className="cinematic-home__statement" aria-live="polite" aria-atomic="true">
        <span>{direction.index} / {direction.label} · {currentCopy.label}</span>
        <p>{currentCopy.statement}</p>
      </div>

      <div className="cinematic-home__actions" role="group" aria-label="Acciones del umbral">
        {direction.id === 'portal' && (
          <button
            className="cinematic-home__illumination"
            type="button"
            aria-pressed={maximumIllumination}
            onClick={() => setMaximumIllumination(true)}
          >
            {maximumIllumination ? 'Iluminación máxima' : 'Activar iluminación máxima'}
          </button>
        )}
        {isQuintessence && (
          <div className="cinematic-home__matter-actions">
            <button
              className="cinematic-home__gather"
              type="button"
              aria-describedby="cinematic-home-statement"
              disabled={gathered}
              onClick={gather}
            >
              Reunir
            </button>
            <button
              className="cinematic-home__disperse"
              type="button"
              aria-describedby="cinematic-home-statement"
              disabled={phase === 'dormancy'}
              onClick={disperse}
            >
              Dispersar
            </button>
          </div>
        )}
        <Link className="cinematic-home__entry" to="/artist">
          <span>Entrar</span>
          <b aria-hidden="true">↗</b>
        </Link>
      </div>

      {laboratory && (
        <nav className="cinematic-home__directions" aria-label="Laboratorio de prototipos Home">
          {homeDirections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === direction.id}
              onClick={() => selectLaboratoryDirection(item.id)}
            >
              <span>{item.index}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>
      )}

      <nav className="cinematic-home__routes" aria-label="Accesos directos">
        <Link to="/music">Music</Link>
        <Link to="/portal">Portal</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </section>
  )
}
