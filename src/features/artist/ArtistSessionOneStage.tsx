import { lazy, Suspense } from 'react'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'
import { artistSessionCopy } from './artistSessionCopy'

const SignalScene = lazy(() => import('../../components/SignalScene').then((module) => ({ default: module.default })))

interface ArtistSessionOneStageProps {
  readonly activeIdentity: string
}

export function ArtistSessionOneStage({ activeIdentity }: ArtistSessionOneStageProps) {
  return (
    <section className="artist-stage artist-stage--signal" data-act="02 / SESION I" aria-labelledby="artist-session-one-title">
      <ArtistSectionTitle kicker="Sesión I" title="Vacío biométrico.">
        <p>{artistSessionCopy.one.body}</p>
        <p>Estado activo: <strong>{activeIdentity}</strong>.</p>
      </ArtistSectionTitle>
      <ArtistSceneFrame className="artist-stage__scene--signal">
        <Suspense fallback={<p className="artist-loader">Cargando escena de señal.</p>}>
          <SignalScene className="artist-artifact-shell artist-artifact-shell--signal" label="Five colored gems orbiting a golden key" />
        </Suspense>
      </ArtistSceneFrame>
    </section>
  )
}
