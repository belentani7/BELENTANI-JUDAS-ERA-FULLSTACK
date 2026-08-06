import { Menu, Pause, Play, Shuffle, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { routeDefinitions } from '../data/routes'
import { themes } from '../data/themes'
import { useMotion } from './MotionProvider'
import { useWorld } from './WorldProvider'

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation()
  const stage = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { motionEnabled, setMotionEnabled } = useMotion()
  const { world, selectWorld, shuffleWorld } = useWorld()

  useEffect(() => {
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

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className="topbar">
        <NavLink className="brand-lockup" to="/" aria-label="BELENTANI, inicio">
          <span>BELENTANI</span>
          <span className="signal-mark" aria-hidden="true" />
          <small>RUPTURA / SEÑAL</small>
        </NavLink>

        <div className="world-controls">
          <label className="sr-only" htmlFor="world-select">Mundo visual</label>
          <select id="world-select" value={world.id} onChange={(event) => selectWorld(event.target.value)}>
            {themes.map((theme, index) => (
              <option key={theme.id} value={theme.id}>{String(index + 1).padStart(2, '0')} · {theme.name}</option>
            ))}
          </select>
          <button className="icon-button" type="button" onClick={shuffleWorld} title="Cambiar mundo al azar" aria-label="Cambiar mundo al azar">
            <Shuffle size={18} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setMotionEnabled(!motionEnabled)}
            title={motionEnabled ? 'Pausar movimiento' : 'Activar movimiento'}
            aria-label={motionEnabled ? 'Pausar movimiento' : 'Activar movimiento'}
            aria-pressed={!motionEnabled}
          >
            {motionEnabled ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="primary-nav" aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <nav id="primary-nav" className="route-rail" data-open={menuOpen} aria-label="Secciones">
        <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''} end>00 <span>Origen</span></NavLink>
        {routeDefinitions.filter((route) => route.path !== '/').map((route, index) => (
          <NavLink key={route.path} to={route.path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
            {String(index + 1).padStart(2, '0')} <span>{route.navLabel}</span>
          </NavLink>
        ))}
      </nav>

      <main id="main-content" ref={stage} key={location.pathname}>
        {children}
      </main>

      <footer className="site-footer">
        <p>BELENTANI / JUDAS / NOIACORE</p>
        <p>Archivo vivo · Barcelona · 2026</p>
      </footer>
    </div>
  )
}
