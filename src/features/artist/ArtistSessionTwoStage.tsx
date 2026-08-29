import { lazy, Suspense } from 'react'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'
import { artistSessionCopy } from './artistSessionCopy'

const NeonUniverse = lazy(() => import('../../components/NeonUniverse').then((module) => ({ default: module.NeonUniverse })))

interface ArtistSessionTwoStageProps {
  readonly motionEnabled: boolean
}

export function ArtistSessionTwoStage({ motionEnabled }: ArtistSessionTwoStageProps) {
  return (
    <section className="artist-stage artist-stage--neon" data-act="03 / SESION II" aria-labelledby="artist-session-two-title">
      <ArtistSectionTitle kicker="Sesión II" title="Catedral de Judas.">
        <p>{artistSessionCopy.two.body}</p>
      </ArtistSectionTitle>
      <ArtistSceneFrame className="artist-stage__scene--neon">
        <Suspense fallback={<p className="artist-loader">Cargando campo neon.</p>}>
          <NeonUniverse active={motionEnabled} intensity={motionEnabled ? 0.92 : 0.46} />
        </Suspense>
      </ArtistSceneFrame>
    </section>
  )
}
