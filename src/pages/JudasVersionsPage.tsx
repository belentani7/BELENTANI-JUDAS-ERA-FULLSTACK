import { ArrowDown, ArrowUpRight, Pause, Play, ScanLine } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { EvilEye } from '../components/EvilEye'
import { NeonUniverse } from '../components/NeonUniverse'
import { SingularityCore } from '../components/SingularityCore'
import { judasVersions, legacySignals } from '../data/judasVersions'
import { useMotion } from '../shell/MotionProvider'

type StudyStyle = CSSProperties & {
  '--study-bg': string
  '--study-fg': string
  '--study-accent': string
  '--study-secondary': string
}

export function JudasVersionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedId = searchParams.get('study')
  const selectedIndex = Math.max(0, judasVersions.findIndex((version) => version.id === requestedId))
  const selected = judasVersions[selectedIndex]
  const stageRef = useRef<HTMLElement>(null)
  const { motionEnabled, setMotionEnabled } = useMotion()
  const showsEye = ['memory-museum', 'automation-loop', 'field-circle'].includes(selected.id)

  const style = useMemo<StudyStyle>(() => ({
    '--study-bg': selected.palette.background,
    '--study-fg': selected.palette.foreground,
    '--study-accent': selected.palette.accent,
    '--study-secondary': selected.palette.secondary,
  }), [selected])

  useLayoutEffect(() => {
    if (!motionEnabled || !stageRef.current) return
    const context = gsap.context(() => {
      gsap.fromTo('.judas-study__image img', { scale: 1.08, filter: 'brightness(0.45)' }, { scale: 1, filter: 'brightness(0.82)', duration: 1.1, ease: 'belentani-signal' })
      gsap.fromTo('.judas-study__copy > *', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'belentani-signal' })
      gsap.fromTo('.judas-study__ring', { scale: 0.72, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.25, ease: 'belentani-signal' })
    }, stageRef)
    return () => context.revert()
  }, [motionEnabled, selected.id])

  const chooseVersion = (id: string) => setSearchParams({ study: id }, { replace: true })
  const selectNext = () => chooseVersion(judasVersions[(selectedIndex + 1) % judasVersions.length].id)

  return (
    <div className="page page--judas-versions" data-route-root style={style}>
      <header className="judas-versions-head">
        <div>
          <p className="page__eyebrow">JUDAS / VERSION LAB</p>
          <span>12 HTML de referencia · 12 direcciones originales</span>
        </div>
        <h1>El mismo núcleo. Doce mutaciones.</h1>
        <p>
          Cada estudio toma un patrón de navegación o interacción del archivo proporcionado y lo
          reescribe dentro del mundo BELENTANI. Código, marcas e imágenes de terceros no se importan.
        </p>
      </header>

      <section
        aria-label={`Estudio ${selected.number}: ${selected.title}`}
        className="judas-study"
        data-family={selected.family}
        data-study={selected.id}
        ref={stageRef}
      >
        <NeonUniverse active={motionEnabled} intensity={selected.family === 'spatial' ? 1 : 0.72} />
        <div className="judas-study__image" aria-hidden="true">
          <img alt="" src={selected.image} />
          <div className="judas-study__ring" />
          <div className="judas-study__scan" />
        </div>

        <div className="judas-study__artifact">
          {showsEye ? <EvilEye active={motionEnabled} /> : <SingularityCore active={motionEnabled} />}
        </div>

        <div className="judas-study__hud judas-study__hud--top">
          <span><ScanLine size={14} />SEÑAL {selected.number}</span>
          <span>{selected.realityMode}</span>
        </div>

        <div className="judas-study__copy">
          <p className="judas-study__source">ESTUDIO {selected.number} / {selected.sourceTitle}</p>
          <h2>{selected.title}</h2>
          <p>{selected.thesis}</p>
          <div className="judas-study__actions">
            <a href="#study-blueprint">Atravesar versión <ArrowDown size={16} /></a>
            <button onClick={selectNext} type="button">Siguiente señal <ArrowUpRight size={16} /></button>
          </div>
        </div>

        <div className="judas-study__hud judas-study__hud--bottom">
          <span>{selected.legacySignal}</span>
          <button aria-label={motionEnabled ? 'Pausar movimiento de la versión' : 'Activar movimiento de la versión'} onClick={() => setMotionEnabled(!motionEnabled)} type="button">
            {motionEnabled ? <Pause size={14} /> : <Play size={14} />}
            {motionEnabled ? 'MOVIMIENTO ON' : 'MOVIMIENTO OFF'}
          </button>
        </div>
      </section>

      <nav className="judas-version-selector" aria-label="Versiones JUDAS">
        {judasVersions.map((version) => (
          <button
            aria-current={selected.id === version.id ? 'page' : undefined}
            key={version.id}
            onClick={() => chooseVersion(version.id)}
            type="button"
          >
            <span>{version.number}</span>
            <strong>{version.shortTitle}</strong>
            <small>{version.sourceTitle}</small>
          </button>
        ))}
      </nav>

      <section className="judas-components" aria-labelledby="judas-components-title">
        <div className="judas-components__intro">
          <p className="page__kicker">NOIACORE / tres fuentes reescritas</p>
          <h2 id="judas-components-title">Ojo, singularidad y universo ya son un solo instrumento.</h2>
          <p>
            El universo responde como fondo adaptativo; el ojo marca el mito; la singularidad marca
            el punto de fusión. El control global pausa las tres capas y mantiene una composición estática completa.
          </p>
        </div>
        <div className="judas-components__ledger">
          <article><span>01 / OJO</span><strong>Rediseñado</strong><p>SVG original, iris, llave, halo y órbitas accesibles.</p></article>
          <article><span>02 / NÚCLEO</span><strong>Rojo y personal</strong><p>Singularidad limpia con marca BELENTANI y lectura bifocal.</p></article>
          <article><span>03 / UNIVERSO</span><strong>Complejidad adaptativa</strong><p>Canvas con profundidad, filamentos, lente, disco, jets y ondas.</p></article>
        </div>
      </section>

      <section className="judas-blueprint" id="study-blueprint" aria-labelledby="study-blueprint-title">
        <div className="judas-blueprint__intro">
          <p className="page__kicker">Blueprint activo / {selected.number}</p>
          <h2 id="study-blueprint-title">{selected.interaction}</h2>
          <p>
            Referencia: {selected.sourceKind}. Uso: patrón y crítica. La versión BELENTANI mantiene
            autoría visual propia y etiqueta el cruce entre vida, archivo y mito.
          </p>
        </div>
        <ol className="judas-blueprint__steps">
          {selected.structure.map((step, index) => (
            <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong></li>
          ))}
        </ol>
      </section>

      <section className="judas-lineage" aria-labelledby="judas-lineage-title">
        <div>
          <p className="page__kicker">Linaje 2024—2026</p>
          <h2 id="judas-lineage-title">Lo antiguo permanece como ADN, no como plantilla.</h2>
        </div>
        <ul>{legacySignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        <p>
          Las capturas BuildAI conservan terminal, escarlata, halo y telemetría. Claims como
          “verified global artist”, diagnósticos o métricas ficticias quedan fuera del canon factual.
        </p>
      </section>

      <footer className="page__footer">
        <Link to="/judas">Volver a los capítulos</Link>
        <Link to="/atlas">Abrir Atlas HTML</Link>
        <Link to="/rights">Procedencia</Link>
      </footer>
    </div>
  )
}

export default JudasVersionsPage
