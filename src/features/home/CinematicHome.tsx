import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { useMotion } from '../../shell/MotionProvider'
import { HomeArtifactScene } from './HomeArtifactScene'
import { getHomeDirection, homeDirections } from './homeDirections'

export function CinematicHome() {
  const root = useRef<HTMLElement>(null)
  const [maximumIllumination, setMaximumIllumination] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { motionEnabled } = useMotion()
  const direction = getHomeDirection(searchParams.get('direction'))

  useEffect(() => {
    if (!root.current || !motionEnabled) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.cinematic-home__title span',
        { yPercent: 115, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.08, ease: 'belentani-signal' },
      )
      gsap.fromTo(
        '.cinematic-home__statement, .cinematic-home__entry',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.78, stagger: 0.09, delay: 0.28, ease: 'belentani-signal' },
      )
    }, root)
    return () => context.revert()
  }, [direction.id, motionEnabled])

  useEffect(() => {
    setMaximumIllumination(false)
    if (direction.id !== 'portal' || !motionEnabled) return
    const timeout = window.setTimeout(() => setMaximumIllumination(true), 9000)
    return () => window.clearTimeout(timeout)
  }, [direction.id, motionEnabled])

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!root.current || !motionEnabled) return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    root.current.style.setProperty('--pointer-x', x.toFixed(3))
    root.current.style.setProperty('--pointer-y', y.toFixed(3))
  }

  return (
    <section
      ref={root}
      className="cinematic-home"
      data-direction={direction.id}
      data-illuminated={maximumIllumination || undefined}
      style={{ '--home-accent': direction.accent } as React.CSSProperties}
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
        <HomeArtifactScene
          direction={direction.id}
          accent={direction.accent}
          motionEnabled={motionEnabled}
          maximumIllumination={maximumIllumination}
        />
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
        <p>{direction.statement}</p>
      </div>

      <Link className="cinematic-home__entry" to="/artist">
        <span>Entrar en el mundo</span>
        <b aria-hidden="true">↗</b>
      </Link>

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

      <nav className="cinematic-home__directions" aria-label="Direcciones visuales de Home">
        {homeDirections.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === direction.id}
            onClick={() => setSearchParams({ direction: item.id }, { replace: true })}
          >
            <span>{item.index}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </nav>

      <nav className="cinematic-home__routes" aria-label="Accesos directos">
        <Link to="/music">Music</Link>
        <Link to="/portal">Portal</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </section>
  )
}
