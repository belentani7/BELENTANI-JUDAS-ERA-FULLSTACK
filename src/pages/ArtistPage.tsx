import { useMemo, useRef, useState } from 'react'
import { routeDefinitions } from '../data/routes'
import { homeDirections, type HomeDirectionId } from '../features/home/homeDirections'
import { useMotion } from '../shell/MotionProvider'
import { ArtistConsole } from '../features/artist/ArtistConsole'
import { ArtistFooter } from '../features/artist/ArtistFooter'
import { ArtistHero } from '../features/artist/ArtistHero'
import { ArtistAvatarStage } from '../features/artist/ArtistAvatarStage'
import { ArtistSessionOneStage } from '../features/artist/ArtistSessionOneStage'
import { ArtistSessionTwoStage } from '../features/artist/ArtistSessionTwoStage'
import { ArtistArtifactsStage } from '../features/artist/ArtistArtifactsStage'
import { ArtistSymbolsStage } from '../features/artist/ArtistSymbolsStage'
import { ArtistRoadmapStage } from '../features/artist/ArtistRoadmapStage'
import { useArtistMotion } from '../features/artist/artistHooks'

const artistRoute = routeDefinitions.find((route) => route.path === '/artist')

export function ArtistPage() {
  const root = useRef<HTMLDivElement>(null)
  const { motionEnabled } = useMotion()
  const [worldDirection, setWorldDirection] = useState<HomeDirectionId>('quintessence')
  const [symbolsPulse, setSymbolsPulse] = useState(false)
  const [portalIdentity, setPortalIdentity] = useState('Portal inicial')

  useArtistMotion(root, motionEnabled)

  const activeDirection = useMemo(
    () => homeDirections.find((candidate) => candidate.id === worldDirection) ?? homeDirections[0],
    [worldDirection],
  )

  return (
    <div ref={root} className="page page--artist" data-route-root>
      <ArtistHero />
      <ArtistConsole />
      <ArtistAvatarStage
        directions={homeDirections}
        activeDirection={activeDirection}
        motionEnabled={motionEnabled}
        onSelectDirection={(id) => setWorldDirection(id as HomeDirectionId)}
      />
      <ArtistSessionOneStage activeIdentity={portalIdentity} />
      <ArtistSessionTwoStage motionEnabled={motionEnabled} />
      <ArtistArtifactsStage onSelectIdentity={setPortalIdentity} />
      <ArtistSymbolsStage active={symbolsPulse} onToggle={() => setSymbolsPulse((previous) => !previous)} />
      <ArtistRoadmapStage />
      <ArtistFooter />
      <p className="sr-only">{artistRoute?.summary ?? ''}</p>
    </div>
  )
}

export default ArtistPage
