import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useMotion } from '../../shell/MotionProvider'
import { HomeArtifactScene } from './HomeArtifactScene'
import { getHomeDirection, homeDirections } from './homeDirections'
import type { QuintessencePhase } from './QuintessenceWorld'

const PHASE_COPY: Record<QuintessencePhase, string> = {
  dormancy: 'La materia espera antes de recordar.',
  memory: 'La memoria vuelve a emitir señal.',
  convergence: 'Los fragmentos empiezan a reunirse.',
  shockwave: 'La forma deja de ser estable.',
  threshold: 'Lo que parecía fragmento era umbral.',
}

export function CinematicHome() {
  const root = useRef<HTMLElement>(null)
  const timers = useRef<number[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const { motionEnabled } = useMotion()
  const labMode = searchParams.get('lab') === 'home'
  const requestedDirection = searchParams.get('direction')
  const direction = labMode ? getHomeDirection(requestedDirection) : getHomeDirection('quintessence')
  const [experienceState, setExperienceState] = useState<QuintessencePhase>('dormancy')
  const [maximumIllumination, setMaximumIllumination] = useState(false)

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  useEffect(() => {
    if (!root.current || !motionEnabled) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.cinematic-home__title span',
        { yPercent: 115, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.08, ease: 'belentani-signal' },
      )
      gsap.fromTo(
        '.cinematic-home__statement, .cinematic-home__entry, .cinematic-home__controls',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.09, delay: 0.28, ease: 'belentani-signal' },
      )
    }, root)
    return () => context.revert()
  }, [direction.id, motionEnabled])

  useEffect(() => {
    if (direction.id !== 'quintessence') {
      setExperienceState('dormancy')
      setMaximumIllumination(false)
    }
  }, [direction.id])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!root.current || !motionEnabled) return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    root.current.style.setProperty('--pointer-x', x.toFixed(3))
    root.current.style.setProperty('--pointer-y', y.toFixed(3))
  }

  const gather = () => {
    clearTimers()
    if (!motionEnabled) {
      setExperienceState('threshold')
      return
    }
    setExperienceState('convergence')
    timers.current.push(window.setTimeout(() => setExperienceState('shockwave'), 90))
    timers.current.push(window.setTimeout(() => setExperienceState('threshold'), 240))
  }

  const handleGatherFocus = () => {
    if (experienceState === 'dormancy') setExperienceState('memory')
  }

  const disperse = () => {
    clearTimers()
    setExperienceState('dormancy')
  }

  const isQuintessence = direction.id === 'quintessence'
  const isGathered = experienceState !== 'dormancy'
  const statement = isQuintessence ? PHASE_COPY[experienceState] : direction.statement

  return (
    <section
      ref={root}
      className="cinematic-home"
      data-direction={direction.id}
      data-experience-state={experienceState}
      data-gathered={isGathered ? 'true' : 'false'}
      data-illuminated={maximumIllumination ? 'true' : 'false'}
      style={{ '--home-accent': direction.accent } as CSSProperties}
      onPointerMove={handlePointerMove}
      aria-labelledby="cinematic-home-title"
      data-route-root
    >
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
        <figure className="cinematic-home__entity">
          <HomeArtifactScene
            direction={direction.id}
            accent={direction.accent}
            motionEnabled={motionEnabled}
            maximumIllumination={maximumIllumination}
            quintessencePhase={experienceState}
          />
          {isQuintessence && <figcaption>Entidad heroica de quinta materia</figcaption>}
        </figure>
      </div>

      <p className="cinematic-home__edition">WEB EXPERIENCE / 2026</p>
      <p className="cinematic-home__coordinates">41.3874° N<br />2.1686° E</p>

      <h1 id="cinematic-home-title" className="cinematic-home__title" aria-label="BELENTANI">
        {direction.title.map((line) => (
          <span key={line}><i>{line}</i></span>
        ))}
      </h1>

      <div className="cinematic-home__statement" aria-live="polite">
        <span>{direction.index} / {direction.label}</span>
        <p>{statement}</p>
      </div>

      {isQuintessence && (
        <div className="cinematic-home__controls" aria-label="Controles de la quinta materia">
          <button type="button" onFocus={handleGatherFocus} onClick={gather} disabled={experienceState === 'threshold'}>
            Reunir
          </button>
          <button type="button" onClick={disperse} disabled={!isGathered}>
            Dispersar
          </button>
          {labMode && direction.id === 'portal' && (
            <button
              type="button"
              aria-pressed={maximumIllumination}
              onClick={() => setMaximumIllumination((current) => !current)}
            >
              {maximumIllumination ? 'Iluminación máxima' : 'Activar iluminación máxima'}
            </button>
          )}
        </div>
      )}

      <Link className="cinematic-home__entry" to="/artist">
        <span>Entrar</span>
        <b aria-hidden="true">↗</b>
      </Link>

      {labMode && (
        <nav className="cinematic-home__directions" aria-label="Laboratorio de prototipos Home">
          {homeDirections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === direction.id}
              onClick={() => setSearchParams({ lab: 'home', direction: item.id }, { replace: true })}
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
