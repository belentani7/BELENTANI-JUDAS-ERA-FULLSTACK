import { ArtistMetricPanel } from './ArtistMetricPanel'
import { artistBlueprintSources } from './artistBlueprintSources'
import { artistMetrics } from './artistMetrics'

export function ArtistConsole() {
  return (
    <section className="artist-console">
      <div className="artist-console__panel">
        <p className="page__kicker">STACK DE PUNTA</p>
        <h2>WebGPU, Three.js y control local.</h2>
        <ul className="artist-source-list">
          {artistBlueprintSources.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div className="artist-console__matrix" aria-label="Resumen de arquitectura">
        {artistMetrics.map((metric) => <ArtistMetricPanel key={metric.label} {...metric} />)}
      </div>
    </section>
  )
}
