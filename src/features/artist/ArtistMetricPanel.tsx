interface ArtistMetricPanelProps {
  readonly label: string
  readonly value: string
  readonly description: string
}

export function ArtistMetricPanel({ label, value, description }: ArtistMetricPanelProps) {
  return (
    <article className="artist-metric-panel">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  )
}

