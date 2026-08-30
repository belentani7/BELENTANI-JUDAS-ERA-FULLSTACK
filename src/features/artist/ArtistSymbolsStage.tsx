import { EvilEye } from '../../components/EvilEye'
import { SingularityCore } from '../../components/SingularityCore'
import { artistSymbolCopy } from './artistSymbolCopy'
import { ArtistSceneFrame } from './ArtistSceneFrame'
import { ArtistSectionTitle } from './ArtistSectionTitle'

interface ArtistSymbolsStageProps {
  readonly active: boolean
  readonly onToggle: () => void
}

export function ArtistSymbolsStage({ active, onToggle }: ArtistSymbolsStageProps) {
  return (
    <section className="artist-stage artist-stage--symbols" data-act="05 / METRICAS" aria-labelledby="artist-metrics-title">
      <ArtistSectionTitle kicker="Métricas" title="Detalle, precisión, presencia.">
        <p>{artistSymbolCopy.body}</p>
        <button type="button" className="artist-button" onClick={onToggle}>
          {active ? artistSymbolCopy.inactiveLabel : artistSymbolCopy.activeLabel}
        </button>
      </ArtistSectionTitle>
      <ArtistSceneFrame className="artist-stage__scene--symbols">
        <div className="artist-symbols">
          <EvilEye active={active} />
          <SingularityCore active={active} />
        </div>
      </ArtistSceneFrame>
    </section>
  )
}
