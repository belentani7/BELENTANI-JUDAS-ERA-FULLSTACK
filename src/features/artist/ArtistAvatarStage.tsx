import type { HomeDirection } from '../home/homeDirections'
import { HomeArtifactScene } from '../home/HomeArtifactScene'
import { ArtistDirectionTabs } from './ArtistDirectionTabs'
import { artistHeroCopy } from './artistHeroCopy'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'
import { ArtistStageCopy } from './ArtistStageCopy'

interface ArtistAvatarStageProps {
  readonly directions: readonly HomeDirection[]
  readonly activeDirection: HomeDirection
  readonly motionEnabled: boolean
  readonly onSelectDirection: (id: string) => void
}

export function ArtistAvatarStage({ directions, activeDirection, motionEnabled, onSelectDirection }: ArtistAvatarStageProps) {
  return (
    <section className="artist-stage" data-act="01 / AVATAR" aria-labelledby="artist-avatar-title">
      <ArtistSectionTitle kicker={`${activeDirection.index} · ${activeDirection.label}`} title="Avatar milimétrico.">
        <p>{artistHeroCopy.body}</p>
        <ArtistDirectionTabs directions={directions} activeId={activeDirection.id} onSelect={onSelectDirection} />
      </ArtistSectionTitle>
      <ArtistSceneFrame>
        <HomeArtifactScene
          direction={activeDirection.id}
          accent={activeDirection.accent}
          motionEnabled={motionEnabled}
          maximumIllumination={motionEnabled && activeDirection.id === 'portal'}
          quintessencePhase="dormancy"
        />
        <ArtistStageCopy kicker="LECTURA MATERIAL">
          <p>{activeDirection.statement}</p>
        </ArtistStageCopy>
      </ArtistSceneFrame>
    </section>
  )
}
