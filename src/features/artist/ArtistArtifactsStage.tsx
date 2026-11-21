import { lazy, Suspense } from 'react'
import { artistArtifactCopy } from './artistArtifactCopy'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'

const PortalExperience = lazy(() => import('../../components/PortalExperience').then((module) => ({ default: module.default })))

interface ArtistArtifactsStageProps {
  readonly onSelectIdentity: (label: string) => void
}

export function ArtistArtifactsStage({ onSelectIdentity }: ArtistArtifactsStageProps) {
  return (
    <section className="artist-stage artist-stage--portal" data-act="04 / ARTEFACTOS" aria-labelledby="artist-artifacts-title">
      <ArtistSectionTitle kicker="Artefactos" title="Llave dorada y cinco diamantes.">
        <p>{artistArtifactCopy.body}</p>
      </ArtistSectionTitle>
      <ArtistSceneFrame className="artist-stage__scene--portal">
        <Suspense fallback={<p className="artist-loader">Cargando panel de portal.</p>}>
          <PortalExperience onSelect={(identity) => onSelectIdentity(identity.label)} storageKey="belentani-artist-portal-progress" />
        </Suspense>
      </ArtistSceneFrame>
    </section>
  )
}
