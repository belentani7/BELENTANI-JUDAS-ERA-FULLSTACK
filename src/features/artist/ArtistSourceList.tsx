interface ArtistSourceListProps {
  readonly sources: readonly string[]
}

export function ArtistSourceList({ sources }: ArtistSourceListProps) {
  return (
    <ul className="artist-source-list">
      {sources.map((source) => <li key={source}>{source}</li>)}
    </ul>
  )
}

