import { Menu, Pause, Play, Shuffle, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { routeDefinitions } from '../data/routes'
import { themes } from '../data/themes'
import { useMotion } from './MotionProvider'
import { useWorld } from './WorldProvider'

const navigationGroups = [
  {
    label: 'Identidad',
    signal: 'ORIGEN / UMBRAL',
    summary: 'Nombre, cuerpo y entrada al mundo vivo.',
    routes: [
      { path: '/', label: 'Signal / Home' },
      { path: '/artist', label: 'The Artist' },
      { path: '/portal', label: 'World / Portal' },
    ],
  },
  {
    label: 'Obras',
    signal: 'OBRA / SELLO',
    summary: 'Piezas públicas y una obra protegida por silencio.',
    routes: [
      { path: '/music', label: 'Music' },
      { path: '/judas', label: 'JUDAS — Sealed Work' },
      { path: '/film', label: 'Film' },
      { path: '/books', label: 'Books' },
    ],
  },
  {
    label: 'Ecosistema',
    signal: 'SISTEMA / MATERIA',
    summary: 'Archivo, herramientas y experimentación conectada.',
    routes: [
      { path: '/archive', label: 'Archive' },
      { path: '/studio', label: 'Studio' },
      { path: '/art-lab', label: 'Art Lab' },
    ],
  },
  {
    label: 'Información',
    signal: 'CONTEXTO / DERECHOS',
    summary: 'Procedencia, límites y vías de contacto.',
    routes: [
      { path: '/rights', label: 'Rights & Credits' },
      { path: '/contact', label: 'Contact' },
    ],
  },
] as const

const internalPaths = new Set(['/atlas', '/noiacore', '/agents', '/prisma'])
const sealedPrefixes = ['/judas'] as const

function isNonIndexable(pathname: string): boolean {
  return internalPaths.has(pathname) || sealedPrefixes.some((prefix) => (
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  ))
}

function getRouteLabel(pathname: string): string {
  const route = routeDefinitions.find((candidate) => (
    candidate.path === pathname || (candidate.path !== '/' && pathname.startsWith(`${candidate.path}/`))
  ))
  return route?.navLabel ?? (pathname === '/' ? 'Signal' : 'Unknown signal')
}

function getNavigationGroup(pathname: string) {
  return navigationGroups.find((group) => group.routes.some((route) => (
    route.path === pathname || (route.path !== '/' && pathname.startsWith(`${route.path}/`))
  ))) ?? navigationGroups[0]
}

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const stage = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const menuClose = useRef<HTMLButtonElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const menuWasOpen = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuTerritory, setMenuTerritory] = useState(() => getNavigationGroup(location.pathname))
  const { motionEnabled, setMotionEnabled, setScrollLocked } = useMotion()
  const { world, selectWorld, shuffleWorld } = useWorld()
  const routeLabel = getRouteLabel(location.pathname)

  useEffect(() => {
    setMenuOpen(false)
    setMenuTerritory(getNavigationGroup(location.pathname))
    window.scrollTo({ top: 0 })
    if (!motionEnabled || !stage.current) return
    const context = gsap.context(() => {
      gsap.fromTo(
        stage.current,
        { opacity: 0, y: 18, clipPath: 'inset(0 0 10% 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'belentani-signal' },
      )
    }, stage)
    return () => context.revert()
  }, [location.pathname, motionEnabled])

  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (robots) robots.content = isNonIndexable(location.pathname) ? 'noindex, nofollow' : 'index, follow'
    document.title = `${routeLabel} — BELENTANI`
  }, [location.pathname, routeLabel])

  useLayoutEffect(() => {
    setScrollLocked(menuOpen)
    if (menuOpen) {
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton.current
      document.body.dataset.menuOpen = 'true'
      menuClose.current?.focus({ preventScroll: true })
    } else {
      delete document.body.dataset.menuOpen
      if (menuWasOpen.current) previousFocus.current?.focus()
    }
    menuWasOpen.current = menuOpen

    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !menu.current) return
      const focusable = Array.from(menu.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('hidden'))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      delete document.body.dataset.menuOpen
      setScrollLocked(false)
    }
  }, [menuOpen, setScrollLocked])

  useLayoutEffect(() => {
    if (!menuOpen || !motionEnabled || !menu.current) return
    const context = gsap.context(() => {
      gsap.fromTo(
        '.site-menu__head > *, .site-menu__scene, .site-menu__routes section, .site-menu__settings > *',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.72, stagger: 0.055, ease: 'belentani-signal' },
      )
      gsap.fromTo(
        '.site-menu__constellation i',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: { each: 0.025, from: 'random' }, ease: 'belentani-signal' },
      )
    }, menu)
    return () => context.revert()
  }, [menuOpen, motionEnabled])

  return (
    <div className={isHome ? 'app-shell app-shell--cinematic-home' : 'app-shell'}>
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="topbar">
        <NavLink className="brand-lockup" to="/" aria-label="BELENTANI, inicio">
          <span>BELENTANI</span>
          <span className="signal-mark" aria-hidden="true" />
          <small>{routeLabel}</small>
        </NavLink>

        <nav className="topbar-destinations" aria-label="Destinos principales">
          <NavLink to="/music" className={({ isActive }) => isActive ? 'active' : ''}>Works</NavLink>
          <NavLink to="/portal" className={({ isActive }) => isActive ? 'active' : ''}>World</NavLink>
          <NavLink to="/archive" className={({ isActive }) => isActive ? 'active' : ''}>Archive</NavLink>
        </nav>

        <div className="topbar-actions">
          <button
            className="icon-button motion-button"
            type="button"
            onClick={() => setMotionEnabled(!motionEnabled)}
            title={motionEnabled ? 'Pausar movimiento' : 'Activar movimiento'}
            aria-label={motionEnabled ? 'Pausar movimiento' : 'Activar movimiento'}
            aria-pressed={!motionEnabled}
          >
            {motionEnabled ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="primary-nav"
        className="site-menu"
        data-open={menuOpen}
        role="dialog"
        aria-modal={menuOpen || undefined}
        aria-hidden={!menuOpen}
        aria-labelledby="site-menu-title"
        inert={menuOpen ? undefined : true}
      >
        <div className="site-menu__atmosphere" aria-hidden="true"><span>BELENTANI</span></div>
        <div className="site-menu__head">
          <p>ECOSISTEMA / 2026</p>
          <h2 id="site-menu-title">Elegir un territorio</h2>
          <button ref={menuClose} className="site-menu__close" type="button" data-menu-close onClick={() => setMenuOpen(false)}>
            Cerrar <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="site-menu__body">
          <div className="site-menu__scene" data-territory={menuTerritory.signal} aria-hidden="true">
            <div className="site-menu__constellation">
              {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
            </div>
            <div className="site-menu__aperture"><i /><span /></div>
            <div className="site-menu__scene-copy">
              <span>{menuTerritory.signal}</span>
              <strong>{menuTerritory.label}</strong>
              <small>{menuTerritory.summary}</small>
            </div>
          </div>

          <nav className="site-menu__routes" aria-label="Mapa BELENTANI">
            {navigationGroups.map((group, groupIndex) => (
              <section
                key={group.label}
                aria-labelledby={`menu-group-${groupIndex}`}
                onMouseEnter={() => setMenuTerritory(group)}
                onFocus={() => setMenuTerritory(group)}
              >
                <h3 id={`menu-group-${groupIndex}`}>{String(groupIndex + 1).padStart(2, '0')} / {group.label}</h3>
                {group.routes.map((route, routeIndex) => (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    end={route.path === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'active' : ''}
                  >
                    <span>{String(routeIndex + 1).padStart(2, '0')}</span>
                    <strong>{route.label}</strong>
                  </NavLink>
                ))}
              </section>
            ))}
          </nav>
        </div>

        <div className="site-menu__settings" aria-label="Preferencias de experiencia">
          <div>
            <label htmlFor="world-select">Mundo visual</label>
            <select id="world-select" value={world.id} onChange={(event) => selectWorld(event.target.value)}>
              {themes.map((theme, index) => (
                <option key={theme.id} value={theme.id}>{String(index + 1).padStart(2, '0')} · {theme.name}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={shuffleWorld}>
            <Shuffle size={17} aria-hidden="true" /> Variar mundo
          </button>
          <button type="button" onClick={() => setMotionEnabled(!motionEnabled)} aria-pressed={!motionEnabled}>
            {motionEnabled ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
            {motionEnabled ? 'Pausar movimiento' : 'Activar movimiento'}
          </button>
        </div>
      </div>

      <main id="main-content" ref={stage} key={location.pathname} tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <p>BELENTANI / JUDAS / NOIACORE</p>
        <p>Archivo vivo / Sistema visual / 2026</p>
        <Link to="/rights">Derechos y procedencia</Link>
      </footer>
    </div>
  )
}
