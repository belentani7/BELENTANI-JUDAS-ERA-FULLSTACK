import { ArrowUpRight } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HomeArtifactScene } from '../features/home/HomeArtifactScene'
import { homeDirections, type HomeDirectionId } from '../features/home/homeDirections'
import { routeDefinitions } from '../data/routes'
import { useMotion } from '../shell/MotionProvider'
import { EvilEye } from '../components/EvilEye'
import { SingularityCore } from '../components/SingularityCore'

const SignalScene = lazy(() => import('../components/SignalScene').then((module) => ({ default: module.default })))
const NeonUniverse = lazy(() => import('../components/NeonUniverse').then((module) => ({ default: module.NeonUniverse })))
const PortalExperience = lazy(() => import('../components/PortalExperience').then((module) => ({ default: module.default })))
const AudioDeck = lazy(() => import('../components/AudioDeck').then((module) => ({ default: module.default })))

const artistRoute = routeDefinitions.find((route) => route.path === '/artist')

gsap.registerPlugin(ScrollTrigger)

export function ArtistPageCopy() {
  const root = useRef<HTMLDivElement>(null)
  const { motionEnabled } = useMotion()
  const [worldDirection, setWorldDirection] = useState<HomeDirectionId>('quintessence')
  const [symbolsPulse, setSymbolsPulse] = useState(false)
  const [portalIdentity, setPortalIdentity] = useState('Portal inicial')

  const direction = homeDirections.find((candidate) => candidate.id === worldDirection) ?? homeDirections[0]

  useEffect(() => {
    if (!root.current || !motionEnabled) return
    const context = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>('.artist-stage')
      stages.forEach((stage) => {
        const content = stage.querySelector('.artist-stage__content')
        const scene = stage.querySelector('.artist-stage__scene')
        if (content) {
          gsap.fromTo(content, { opacity: 0.62, y: 72 }, {
            opacity: 1,
            y: 0,
            ease: 'belentani-signal',
            scrollTrigger: { trigger: stage, start: 'top 72%', end: 'top 30%', scrub: 0.7 },
          })
        }
        if (scene) {
          gsap.fromTo(scene, { clipPath: 'inset(9% 7% 9% 7%)', scale: 0.94 }, {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            ease: 'belentani-signal',
            scrollTrigger: { trigger: stage, start: 'top 82%', end: 'center 48%', scrub: 0.8 },
          })
        }
      })
    }, root)
    return () => context.revert()
  }, [motionEnabled])

  return (
    <div ref={root} className="page page--artist" data-route-root>
      <header className="artist-identity">
        <p className="page__eyebrow">PEDRO BELENTANI / BARCELONA</p>
        <h1>No explico un mundo.<br />Lo construyo.</h1>
        <p>{artistRoute?.summary ?? 'Convierto memoria, materia, voz y tecnología en experiencias que se atraviesan.'}</p>
        <p className="artist-identity__status">ARTISTA · DIRECTOR CREATIVO · ARQUITECTO DE EXPERIENCIAS</p>
        <nav className="artist-identity__actions" aria-label="Accesos principales">
          <Link to="/judas">Entrar a JUDAS<ArrowUpRight size={15} /></Link>
          <Link to="/archive">Explorar archivo<ArrowUpRight size={15} /></Link>
          <Link to="/art-lab">Abrir estudio<ArrowUpRight size={15} /></Link>
        </nav>
      </header>

      <section className="artist-stage" data-act="01 / MATERIA" aria-labelledby="artist-world-title">
        <div className="artist-stage__content">
          <p className="page__kicker">{direction.index} · {direction.label}</p>
          <h2 id="artist-world-title">Cinco materias. Una presencia.</h2>
          <p>Mi obra no es una colección de páginas. Es un organismo: memoria, cuerpo, archivo y portal cambian de estado dentro de un mismo mundo.</p>
          <div className="artist-world-switch" role="tablist" aria-label="Opciones de dirección visual">
            {homeDirections.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === worldDirection}
                aria-pressed={item.id === worldDirection}
                onClick={() => setWorldDirection(item.id)}
              >
                {item.index} · {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="artist-stage__scene">
          <HomeArtifactScene
            direction={direction.id}
            accent={direction.accent}
            motionEnabled={motionEnabled}
            maximumIllumination={motionEnabled && direction.id === 'portal'}
            quintessencePhase="dormancy"
          />
          <div className="artist-stage__copy">
            <p className="page__kicker">MANIFIESTO VISUAL</p>
            <p>{direction.statement}</p>
          </div>
        </div>
      </section>

      <section className="artist-stage artist-stage--signal" data-act="02 / SEÑAL" aria-labelledby="artist-signal-title">
        <div className="artist-stage__content">
          <p className="page__kicker">Módulo de señal</p>
          <h2 id="artist-signal-title">Toda memoria emite una señal.</h2>
          <p>Convierto fragmentos en órbitas y claves. Lo que parecía perdido permanece activo, esperando una forma capaz de contenerlo.</p>
          <p>Última identidad activa del portal: <strong>{portalIdentity}</strong>.</p>
        </div>
        <div className="artist-stage__scene artist-stage__scene--signal">
          <Suspense fallback={<p className="artist-loader">Cargando escena de señal.</p>}>
            <SignalScene
              className="artist-artifact-shell artist-artifact-shell--signal"
              label="Five colored gems orbiting a golden key"
            />
          </Suspense>
        </div>
      </section>

      <section className="artist-stage artist-stage--neon" data-act="03 / CAMPO" aria-labelledby="artist-neon-title">
        <div className="artist-stage__content">
          <p className="page__kicker">Campo vectorial</p>
          <h2 id="artist-neon-title">La materia aprende a recordar.</h2>
          <p>Partículas, trazos y luz reaccionan como un campo vivo. La tecnología no ilustra la historia: se convierte en su comportamiento.</p>
        </div>
        <div className="artist-stage__scene artist-stage__scene--neon">
          <Suspense fallback={<p className="artist-loader">Cargando campo neon.</p>}>
            <NeonUniverse active={motionEnabled} intensity={motionEnabled ? 0.9 : 0.45} />
          </Suspense>
        </div>
      </section>

      <section className="artist-stage artist-stage--portal" data-act="04 / UMBRAL" aria-labelledby="artist-portal-title">
        <div className="artist-stage__content">
          <p className="page__kicker">Portal</p>
          <h2 id="artist-portal-title">Cada identidad abre otro umbral.</h2>
          <p>No navego entre secciones: atravieso estados. Cada elección deja una huella local y modifica la forma en que el mundo responde.</p>
        </div>
        <div className="artist-stage__scene artist-stage__scene--portal">
          <Suspense fallback={<p className="artist-loader">Cargando panel de portal.</p>}>
            <PortalExperience onSelect={(identity) => setPortalIdentity(identity.label)} storageKey="belentani-artist-portal-progress" />
          </Suspense>
        </div>
      </section>

      <section className="artist-stage artist-stage--symbols" data-act="05 / NÚCLEO" aria-labelledby="artist-symbol-title">
        <div className="artist-stage__content">
          <p className="page__kicker">Símbolos</p>
          <h2 id="artist-symbol-title">Mirar también transforma.</h2>
          <p>El ojo y la singularidad no son símbolos decorativos. Son dos fuerzas de mi trabajo: observar hasta comprender y comprimir hasta crear otra forma.</p>
          <button type="button" className="artist-button" onClick={() => setSymbolsPulse((previous) => !previous)}>
            {symbolsPulse ? 'Detener pulso' : 'Activar pulso'}
          </button>
        </div>
        <div className="artist-stage__scene artist-stage__scene--symbols">
          <div className="artist-symbols">
            <EvilEye active={symbolsPulse} />
            <SingularityCore active={symbolsPulse} />
          </div>
        </div>
      </section>

      <section className="artist-stage artist-stage--audio" data-act="06 / VOZ" aria-labelledby="artist-audio-title">
        <div className="artist-stage__content">
          <p className="page__kicker">Generación sonora</p>
          <h2 id="artist-audio-title">La voz permanece bajo mi control.</h2>
          <p>La señal sonora es un laboratorio local. Mi voz, mis masters y JUDAS siguen privados: la experiencia pública revela presencia, nunca el archivo íntimo.</p>
        </div>
        <div className="artist-stage__scene artist-stage__scene--audio">
          <Suspense fallback={<p className="artist-loader">Cargando cabina.</p>}>
            <AudioDeck />
          </Suspense>
        </div>
      </section>
    </div>
  )
}

export default ArtistPageCopy
