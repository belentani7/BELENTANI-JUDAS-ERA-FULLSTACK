import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { useMotion } from '../../shell/MotionProvider'
import { judasEraCopy } from './judasEra.copy'
import { JudasEraScene } from './JudasEraScene'
import type { JudasEraLocale, JudasEraSceneState } from './judasEra.types'
import { useJudasEra } from './useJudasEra'

gsap.registerPlugin(ScrollTrigger)

const localeLabels: Readonly<Record<JudasEraLocale, string>> = { es: 'ES', en: 'EN', pt: 'PT', ca: 'CA' }

function useSceneActivity(root: RefObject<HTMLElement | null>): boolean {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const element = root.current
    if (!element) return
    let visible = true
    const update = () => setActive(visible && document.visibilityState === 'visible')
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { rootMargin: '120px' })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [root])

  return active
}

export function JudasEraExperience() {
  const root = useRef<HTMLDivElement>(null)
  const scrollField = useRef<HTMLElement>(null)
  const sceneState = useRef<JudasEraSceneState>({ progress: 0, chapter: 0 })
  const [locale, setLocale] = useState<JudasEraLocale>('es')
  const [activeChapter, setActiveChapter] = useState(0)
  const { motionEnabled } = useMotion()
  const sceneActive = useSceneActivity(scrollField)
  const copy = judasEraCopy[locale]
  const { manifest, connection, reportChapter } = useJudasEra(locale, !motionEnabled)
  const activeImage = copy.chapters[activeChapter]?.image ?? copy.chapters[0].image

  useLayoutEffect(() => {
    const container = root.current
    const field = scrollField.current
    if (!container || !field || !motionEnabled) return

    const context = gsap.context(() => {
      gsap.to(sceneState.current, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: field, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      })

      gsap.utils.toArray<HTMLElement>('[data-era-chapter]').forEach((chapter, index) => {
        const copyBlock = chapter.querySelector('[data-era-copy]')
        if (copyBlock) {
          gsap.fromTo(copyBlock, { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)', yPercent: 12 }, {
            autoAlpha: 1,
            clipPath: 'inset(0 0 0% 0)',
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: chapter, start: 'top 78%', end: 'center 54%', scrub: 0.65 },
          })
        }
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top 56%',
          end: 'bottom 44%',
          onToggle: ({ isActive }) => {
            if (!isActive) return
            sceneState.current.chapter = index
            setActiveChapter(index)
          },
        })
      })

      gsap.fromTo('.judas-era__wordmark', { scaleX: 0.52, opacity: 0.12 }, {
        scaleX: 1,
        opacity: 0.9,
        ease: 'none',
        scrollTrigger: { trigger: '.judas-era__opening', start: 'top top', end: 'bottom 40%', scrub: 0.8 },
      })
      gsap.fromTo('.judas-era__scar', { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: field, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
    }, container)

    return () => context.revert()
  }, [motionEnabled, locale])

  useEffect(() => {
    const chapter = copy.chapters[activeChapter]
    if (chapter) void reportChapter(chapter.id)
  }, [activeChapter, copy.chapters, reportChapter])

  return (
    <div className="page page--judas judas-era" data-route-root ref={root}>
      <div className="judas-era__grain" aria-hidden="true" />
      <nav className="judas-era__locales" aria-label="Idioma de JUDAS ERA">
        {(Object.keys(localeLabels) as JudasEraLocale[]).map((key) => (
          <button aria-pressed={locale === key} key={key} onClick={() => setLocale(key)} type="button">
            {localeLabels[key]}
          </button>
        ))}
      </nav>

      <section className="judas-era__field" id="era-field" ref={scrollField} aria-label="Recorrido JUDAS ERA">
        <div className="judas-era__scene">
          <img className="judas-era__memory" key={activeImage} src={activeImage} alt="" aria-hidden="true" />
          <JudasEraScene active={sceneActive} reducedMotion={!motionEnabled} state={sceneState} />
          <div className="judas-era__scar" aria-hidden="true" />
          <div className="judas-era__progress" aria-hidden="true">
            <span style={{ '--era-step': activeChapter } as CSSProperties} />
          </div>
          <p className="judas-era__seal-state">{manifest.status} / NO PLAYBACK</p>
          <p className="sr-only" aria-live="polite">{connection === 'live' ? copy.live : copy.offline}</p>
          <p className="sr-only">Escultura abstracta y fragmentos rojos. La narrativa completa está disponible como texto.</p>
        </div>

        <div className="judas-era__narrative">
          <header className="judas-era__opening">
            <div className="judas-era__opening-image" aria-hidden="true" />
            <p className="judas-era__eyebrow">{copy.eyebrow}</p>
            <h1 className="judas-era__wordmark">JUDAS</h1>
            <div className="judas-era__opening-copy">
              <p>{copy.intro}</p>
              <a href="#era-threshold">{copy.enter}</a>
            </div>
          </header>

          {copy.chapters.map((chapter, index) => (
            <article
              data-era-chapter
              id={`era-${chapter.id}`}
              key={chapter.id}
              className="judas-era__chapter"
              aria-labelledby={`era-title-${chapter.id}`}
            >
              <div className="judas-era__chapter-copy" data-era-copy>
                <p>{chapter.signal}</p>
                <h2 id={`era-title-${chapter.id}`}>{chapter.title}</h2>
                <p>{chapter.body}</p>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="judas-era__seal" aria-labelledby="era-seal-title">
        <p>JUDAS / BELENTANI</p>
        <h2 id="era-seal-title">{copy.sealed}</h2>
        <div>
          <Link to="/artist">THE ARTIST</Link>
          <Link to="/archive">ARCHIVE</Link>
          <Link to="/portal">PORTAL</Link>
        </div>
      </section>
    </div>
  )
}
