import { lazy, Suspense } from 'react'
import { artistRoadmap } from './artistRoadmap'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'

const AudioDeck = lazy(() => import('../../components/AudioDeck').then((module) => ({ default: module.default })))

export function ArtistRoadmapStage() {
  return (
    <section className="artist-stage artist-stage--audio" data-act="06 / ROADMAP" aria-labelledby="artist-roadmap-title">
      <ArtistSectionTitle kicker="Roadmap" title="De blueprint a producción.">
        <div className="artist-roadmap">
          {artistRoadmap.map(([step, title]) => (
            <article key={step}>
              <span>{step}</span>
              <strong>{title}</strong>
            </article>
          ))}
        </div>
      </ArtistSectionTitle>
      <ArtistSceneFrame className="artist-stage__scene--audio">
        <Suspense fallback={<p className="artist-loader">Cargando cabina.</p>}>
          <AudioDeck />
        </Suspense>
      </ArtistSceneFrame>
    </section>
  )
}
