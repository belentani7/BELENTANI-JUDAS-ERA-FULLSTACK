import type { HomeDirection } from '../home/homeDirections'

interface ArtistDirectionTabsProps {
  readonly directions: readonly HomeDirection[]
  readonly activeId: string
  readonly onSelect: (id: string) => void
}

export function ArtistDirectionTabs({ directions, activeId, onSelect }: ArtistDirectionTabsProps) {
  return (
    <div className="artist-world-switch" role="tablist" aria-label="Dirección visual">
      {directions.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          aria-pressed={item.id === activeId}
          onClick={() => onSelect(item.id)}
        >
          {item.index} · {item.label}
        </button>
      ))}
    </div>
  )
}

