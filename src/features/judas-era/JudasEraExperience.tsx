import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
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
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { rootMargin: '120px' })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
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

  useLayoutEffect(() => {
    const container = root.current
    const field = scrollField.current
    if (!container || !field || !motionEnabled) return
    const context = gsap.context(() => {
      gsap.to(sceneState.current, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: field, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true },
      })
      gsap.utils.toArray<HTMLElement>('[data-era-chapter]').forEach((chapter, index) => {
        const copyBlock = chapter.querySelector('[data-era-copy]')
        const image = chapter.querySelector('[data-era-image]')
        if (copyBlock) {
          gsap.fromTo(copyBlock, { autoAlpha: 0.16, y: 72 }, {
            autoAlpha: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: chapter, start: 'top 78%', end: 'center 48%', scrub: 0.55 },
          })
        }
        if (image) {
          gsap.fromTo(image, { yPercent: -8, scale: 1.08 }, {
            yPercent: 8, scale: 1, ease: 'none',
            scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          })
        }
        ScrollTrigger.create({
          trigger: chapter, start: 'top 52%', end: 'bottom 48%',
          onToggle: ({ isActive }) => {
            if (!isActive) return
            sceneState.current.chapter = index
            setActiveChapter(index)
          },
        })
      })
      gsap.fromTo('.judas-era__wordmark', { letterSpacing: '0.08em', scaleX: 0.74 }, {
        letterSpacing: '-0.075em', scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.judas-era__opening', start: 'top top', end: 'bottom top', scrub: 0.6 },
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
      <div className="judas-era__noise" aria-hidden="true" />
      <nav className="judas-era__locales" aria-label="Idioma de JUDAS ERA">
        {(Object.keys(localeLabels) as JudasEraLocale[]).map((key) => (
          <button aria-pressed={locale === key} key={key} onClick={() => setLocale(key)} type="button">{localeLabels[key]}</button>
        ))}
      </nav>

      <header className="judas-era__opening">
        <div className="judas-era__opening-image" aria-hidden="true" />
        <p className="judas-era__eyebrow">{copy.eyebrow}</p>
        <h1 className="judas-era__wordmark">JUDAS</h1>
        <div className="judas-era__opening-copy">
          <p>{copy.intro}</p>
          <a href="#era-field">{copy.enter}</a>
        </div>
        <div className="judas-era__status" aria-live="polite">
          <span>{manifest.status}</span>
          <span>{connection === 'live' ? copy.live : copy.offline}</span>
          <span>MEDIA: 0</span>
        </div>
      </header>

      <section className="judas-era__field" id="era-field" ref={scrollField} aria-label="Recorrido JUDAS ERA">
        <div className="judas-era__scene">
          <JudasEraScene active={sceneActive} reducedMotion={!motionEnabled} state={sceneState} />
          <div className="judas-era__reticle" aria-hidden="true"><span>{String(activeChapter + 1).padStart(2, '0')}</span></div>
          <p className="sr-only">Artefacto abstracto rodeado de fragmentos rojos. La escena es decorativa y dispone de narrativa textual completa.</p>
        </div>

        <div className="judas-era__narrative">
          {copy.chapters.map((chapter, index) => (
            <article data-era-chapter key={chapter.id} className="judas-era__chapter" aria-labelledby={`era-${chapter.id}`}>
              <div className="judas-era__chapter-image" data-era-image>
                <img src={chapter.image} alt={chapter.alt} loading={index < 2 ? 'eager' : 'lazy'} />
              </div>
              <div className="judas-era__chapter-copy" data-era-copy>
                <p><span>{String(index + 1).padStart(2, '0')}</span> {chapter.signal}</p>
                <h2 id={`era-${chapter.id}`}>{chapter.title}</h2>
                <p>{chapter.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="judas-era__seal" aria-labelledby="era-seal-title">
        <p>PROTOCOL / {manifest.updatedAt.slice(0, 10)}</p>
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
