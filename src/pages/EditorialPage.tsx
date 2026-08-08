import { ArrowUpRight, CheckCircle2, CircleDashed } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { routeDefinitions, type RouteSection } from '../data/routes'
import { NotFoundPage } from './NotFoundPage'

const statusLabel = {
  verified: 'Verificado',
  cautious: 'Lectura editorial',
  pending: 'Pendiente',
} as const

function SectionLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link className="text-link" to={href}>{label}<ArrowUpRight size={15} /></Link>
  }
  return <a className="text-link" href={href}>{label}<ArrowUpRight size={15} /></a>
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  return (
    <form
      id="contact-form"
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
    >
      <label>Asunto<input name="subject" required /></label>
      <label>Ruta
        <select name="route" defaultValue="colaboracion">
          <option value="correccion">Correccion de archivo</option>
          <option value="colaboracion">Colaboracion</option>
          <option value="derechos">Derechos y permisos</option>
        </select>
      </label>
      <label className="contact-form__message">Mensaje<textarea name="message" required rows={6} /></label>
      <button className="command-button" type="submit">Preparar consulta</button>
      <p aria-live="polite">{sent ? 'Consulta preparada localmente. Ningun dato ha sido enviado.' : 'Envio desactivado hasta verificar el canal publico.'}</p>
    </form>
  )
}

function RouteSectionView({ section, routeId }: { section: RouteSection; routeId: string }) {
  const tone = section.type === 'manifesto' ? 'light' : undefined
  return (
    <section className={`section-band route-section route-section--${section.type}`} data-tone={tone} aria-labelledby={`${routeId}-${section.id}`}>
      <div className="section-inner">
        <p className="page__kicker">{section.eyebrow}</p>
        <h2 className="section-heading" id={`${routeId}-${section.id}`}>{section.title}</h2>
        <p className="route-section__body">{section.body}</p>

        {section.type === 'media' && (
          <figure className="media-band">
            <img src="/media/diamond_scene.png" alt="Cinco formas cristalinas suspendidas en una escena azul" />
            <figcaption>Estudio de materia digital / activo local del archivo OMEGA.</figcaption>
          </figure>
        )}

        {section.items && section.items.length > 0 && (
          <div className={`route-section__items route-section__items--${section.type}`}>
            {section.items.map((item) => (
              <article key={item.id} className="route-section__item">
                <p className="page__kicker">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <div className="item-meta">
                  {item.status && (
                    <span data-status={item.status}>
                      {item.status === 'verified' ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
                      {statusLabel[item.status]}
                    </span>
                  )}
                  {item.meta?.startsWith('/') ? <Link to={item.meta}>Abrir {item.meta}</Link> : item.meta && <span>{item.meta}</span>}
                </div>
              </article>
            ))}
          </div>
        )}

        {section.type === 'contact' && <ContactForm />}
        {section.cta && <SectionLink href={section.cta.href} label={section.cta.label} />}
      </div>
    </section>
  )
}

export function EditorialPage() {
  const { routeId = '' } = useParams()
  const route = routeDefinitions.find((candidate) => candidate.path === `/${routeId}`)
  if (!route) return <NotFoundPage />

  const hero = route.sections.find((section) => section.type === 'hero')
  const sections = route.sections.filter((section) => section !== hero)

  return (
    <div className={`page page--route page--${route.id}`} data-route-root>
      <header className="route-page-head">
        <div>
          <p className="page__eyebrow">{hero?.eyebrow ?? `BELENTANI / ${route.navLabel}`}</p>
          <p className="route-status" data-status={route.status}>{statusLabel[route.status]}</p>
        </div>
        <h1>{hero?.title ?? route.title}</h1>
        <p>{hero?.body ?? route.summary}</p>
        {hero?.cta && <SectionLink href={hero.cta.href} label={hero.cta.label} />}
      </header>

      {sections.map((section) => <RouteSectionView key={section.id} section={section} routeId={route.id} />)}

      <nav className="page__footer" aria-label="Rutas relacionadas">
        {route.relatedRoutes.map((path) => {
          const related = routeDefinitions.find((candidate) => candidate.path === path)
          return <Link key={path} to={path}>{related?.navLabel ?? path}</Link>
        })}
      </nav>
    </div>
  )
}

export default EditorialPage
