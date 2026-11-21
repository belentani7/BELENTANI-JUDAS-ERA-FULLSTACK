import { useState } from 'react'
import { studioDomains, studioTools } from './toolCatalog'
import type { StudioDomain, StudioTool } from './studio.types'

const PAGE_SIZE = 20

interface ToolIndexProps {
  activeDomain: StudioDomain | 'all'
  query: string
  selectedId: string
  onDomainChange: (domain: StudioDomain | 'all') => void
  onQueryChange: (query: string) => void
  onSelect: (tool: StudioTool) => void
}

export function ToolIndex({ activeDomain, query, selectedId, onDomainChange, onQueryChange, onSelect }: ToolIndexProps) {
  const [page, setPage] = useState(0)
  const normalizedQuery = query.trim().toLocaleLowerCase('es')
  const filteredTools = studioTools.filter((tool) => {
    const matchesDomain = activeDomain === 'all' || tool.domain === activeDomain
    const matchesQuery = !normalizedQuery || `${tool.name} ${tool.action} ${tool.domainLabel}`.toLocaleLowerCase('es').includes(normalizedQuery)
    return matchesDomain && matchesQuery
  })
  const pageCount = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE))
  const visibleTools = filteredTools.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <aside className="tool-index" aria-labelledby="tool-index-title">
      <div className="tool-index__heading">
        <div>
          <span>REGISTRY / 100</span>
          <h3 id="tool-index-title">Instrumentos</h3>
        </div>
        <output aria-label={`${filteredTools.length} de 100 instrumentos`}>{filteredTools.length} / 100</output>
      </div>

      <label className="tool-search" htmlFor="studio-tool-search">
        <span>Buscar capacidad</span>
        <input
          id="studio-tool-search"
          type="search"
          value={query}
          onChange={(event) => {
            setPage(0)
            onQueryChange(event.target.value)
          }}
          placeholder="imagen, ritmo, mundo…"
        />
      </label>

      <div className="tool-domains" aria-label="Familias de instrumentos">
        <button type="button" aria-pressed={activeDomain === 'all'} onClick={() => { setPage(0); onDomainChange('all') }}>Todos</button>
        {studioDomains.map((domain) => (
          <button
            key={domain.id}
            type="button"
            aria-pressed={activeDomain === domain.id}
            style={{ '--domain-accent': domain.accent } as React.CSSProperties}
            onClick={() => { setPage(0); onDomainChange(domain.id) }}
          >
            {domain.label}
          </button>
        ))}
      </div>

      <ol className="tool-index__list" aria-label={`${filteredTools.length} instrumentos disponibles`}>
        {visibleTools.map((tool) => (
          <li key={tool.id}>
            <button
              type="button"
              aria-pressed={selectedId === tool.id}
              data-tool-id={tool.id}
              style={{ '--tool-accent': tool.accent } as React.CSSProperties}
              onClick={() => onSelect(tool)}
            >
              <span>{String(tool.index).padStart(3, '0')}</span>
              <strong>{tool.name}</strong>
              <small>{tool.domainLabel}</small>
            </button>
          </li>
        ))}
      </ol>
      {filteredTools.length === 0 && <p className="tool-index__empty">Ninguna señal coincide. Cambia el término o la familia.</p>}
      {filteredTools.length > PAGE_SIZE && (
        <nav className="tool-pagination" aria-label="Páginas del registro de instrumentos">
          <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Anterior</button>
          <span>{page + 1} / {pageCount}</span>
          <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>Siguiente</button>
        </nav>
      )}
    </aside>
  )
}
