import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { artistFooterCopy } from './artistFooterCopy'

export function ArtistFooter() {
  return (
    <footer className="artist-footer">
      <div>
        <p className="page__kicker">{artistFooterCopy.title}</p>
        <p>{artistFooterCopy.body}</p>
        <ul>
          <li>{artistFooterCopy.links[0]}</li>
          <li>{artistFooterCopy.links[1]}</li>
          <li>{artistFooterCopy.links[2]}</li>
        </ul>
      </div>
      <Link to="/judas/versions">Abrir estudios JUDAS <ArrowUpRight size={15} /></Link>
    </footer>
  )
}
