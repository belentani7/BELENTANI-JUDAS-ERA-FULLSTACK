import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ArtistHero() {
  return (
    <header className="artist-hero">
      <p className="page__eyebrow">EXPERIENCIA JUDAS / BLUEPRINT TECNICO</p>
      <h1>Realismo inmersivo para BELENTANI.</h1>
      <p>Una GUI web inmersiva para organizar avatar, sesiones, artefactos, señales y un roadmap de producción.</p>
      <div className="artist-hero__actions">
        <Link to="/judas">Abrir JUDAS <ArrowUpRight size={15} /></Link>
        <Link to="/portal">Abrir portal <ArrowUpRight size={15} /></Link>
        <Link to="/archive">Ver archivo <ArrowUpRight size={15} /></Link>
      </div>
    </header>
  )
}

