import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  atlasCounts,
  atlasRelationLabels,
  atlasVisibilityLabels,
  htmlAtlas,
  recoveredFamilies,
  type AtlasRelation,
  type HtmlAtlasRecord,
} from '../data/htmlAtlas'

const pageSize = 48
const relationOptions = ['all', 'core', 'technical', 'reference', 'external'] as const
const visibilityOptions = ['all', 'review', 'private'] as const

type RelationFilter = (typeof relationOptions)[number]
type VisibilityFilter = (typeof visibilityOptions)[number]

const relationColors: Record<AtlasRelation, string> = {
  core: '#f3274c',
  technical: '#72ede1',
  reference: '#e2a94f',
  external: '#6d7280',
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function AtlasField({ records }: { records: readonly HtmlAtlasRecord[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(rect.width * ratio))
      canvas.height = Math.max(1, Math.floor(rect.height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, rect.width, rect.height)

      const columns = Math.max(12, Math.floor(rect.width / 13))
      const rows = Math.ceil(records.length / columns)
      const cellWidth = rect.width / columns
      const cellHeight = rect.height / Math.max(rows, 1)

      records.forEach((record, index) => {
        const column = index % columns
        const row = Math.floor(index / columns)
        const inset = record.visibility === 'private' ? 3.4 : 2.2
        context.globalAlpha = record.structured ? 0.92 : 0.36
        context.fillStyle = relationColors[record.relation]
        context.fillRect(
          column * cellWidth + inset,
          row * cellHeight + inset,
          Math.max(1, cellWidth - inset * 2),
          Math.max(1, cellHeight - inset * 2),
        )
      })
      context.globalAlpha = 1
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [records])

  return (
    <canvas
      aria-label={`Mapa visual de ${records.length} objetos HTML. El color indica relación y la opacidad indica estructura reconocible.`}
      className="atlas-field"
      ref={canvasRef}
      role="img"
    />
  )
}

export function AtlasPage() {
  const [relation, setRelation] = useState<RelationFilter>('all')
  const [visibility, setVisibility] = useState<VisibilityFilter>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return htmlAtlas.records.filter((record) => {
      if (relation !== 'all' && record.relation !== relation) return false
      if (visibility !== 'all' && record.visibility !== visibility) return false
      if (normalizedQuery && !record.id.includes(normalizedQuery) && !record.digest.includes(normalizedQuery)) return false
      return true
    })
  }, [query, relation, visibility])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleRecords = filtered.slice(page * pageSize, page * pageSize + pageSize)

  return (
    <div className="page page--atlas" data-route-root>
      <header className="atlas-head">
        <div>
          <p className="page__eyebrow">BELENTANI / HTML ATLAS</p>
          <p className="atlas-head__mode">REAL / metadatos locales verificados</p>
        </div>
        <h1>691 versiones. Un sistema.</h1>
        <p>
          Cada HTML recuperado conserva una huella anónima, tamaño, estructura y estado editorial.
          El mapa representa el corpus completo sin publicar rutas, nombres privados ni ejecutar código heredado.
        </p>
        <Link className="text-link" to="/judas/versions">Abrir 12 estudios JUDAS</Link>
      </header>

      <section className="atlas-ledger" aria-label="Resumen del corpus">
        <article><strong>{htmlAtlas.uniqueFiles}</strong><span>hashes únicos</span></article>
        <article><strong>{htmlAtlas.sourceInstances}</strong><span>localizaciones</span></article>
        <article><strong>{atlasCounts.structured}</strong><span>HTML estructurales</span></article>
        <article><strong>{atlasCounts.core}</strong><span>señales núcleo</span></article>
        <article><strong>{recoveredFamilies.length}</strong><span>familias integrables</span></article>
      </section>

      <section className="atlas-map" aria-labelledby="atlas-map-title">
        <div className="atlas-map__head">
          <div>
            <p className="page__kicker">Campo completo</p>
            <h2 id="atlas-map-title">Todo está representado; no todo es público.</h2>
          </div>
          <p>{formatBytes(atlasCounts.bytes)} de HTML único catalogado.</p>
        </div>
        <AtlasField records={filtered} />
        <div className="atlas-legend" aria-label="Leyenda del mapa">
          {(Object.keys(atlasRelationLabels) as AtlasRelation[]).map((key) => (
            <span key={key}><i style={{ background: relationColors[key] }} />{atlasRelationLabels[key]}</span>
          ))}
        </div>
      </section>

      <section className="atlas-families" aria-labelledby="atlas-families-title">
        <div className="atlas-section-head">
          <p className="page__kicker">Extracción, no collage</p>
          <h2 id="atlas-families-title">Ocho destinos convierten versiones en arquitectura.</h2>
        </div>
        <div className="atlas-family-grid">
          {recoveredFamilies.map((family) => (
            <article key={family.id}>
              <p>{family.sourceIds.map((id) => `#${id}`).join(' · ')}</p>
              <h3>{family.label}</h3>
              <p>{family.destination}</p>
              <span>{family.state === 'integrating' ? 'En integración' : 'Mapeado'}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="atlas-browser" aria-labelledby="atlas-browser-title">
        <div className="atlas-browser__head">
          <div>
            <p className="page__kicker">Índice sanitizado</p>
            <h2 id="atlas-browser-title">Buscar sin revelar el archivo privado.</h2>
          </div>
          <p aria-live="polite">{filtered.length} resultados</p>
        </div>

        <div className="atlas-controls">
          <label>
            Huella o identificador
            <input onChange={(event) => { setQuery(event.target.value); setPage(0) }} placeholder="html-0041" type="search" value={query} />
          </label>
          <label>
            Relación
            <select onChange={(event) => { setRelation(event.target.value as RelationFilter); setPage(0) }} value={relation}>
              {relationOptions.map((value) => <option key={value} value={value}>{value === 'all' ? 'Todas' : atlasRelationLabels[value]}</option>)}
            </select>
          </label>
          <label>
            Visibilidad
            <select onChange={(event) => { setVisibility(event.target.value as VisibilityFilter); setPage(0) }} value={visibility}>
              {visibilityOptions.map((value) => <option key={value} value={value}>{value === 'all' ? 'Todas' : atlasVisibilityLabels[value]}</option>)}
            </select>
          </label>
        </div>

        <ul className="atlas-records">
          {visibleRecords.map((record) => (
            <li key={record.id}>
              <span>{record.id}</span>
              <strong>{record.digest}</strong>
              <small>{formatBytes(record.bytes)}</small>
              <small>{atlasRelationLabels[record.relation]}</small>
              <small>{record.structured ? 'estructura reconocida' : 'fragmento'}</small>
              <small>{atlasVisibilityLabels[record.visibility]}</small>
            </li>
          ))}
        </ul>

        <nav className="atlas-pagination" aria-label="Páginas del índice">
          <button disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} type="button">Anterior</button>
          <span>Página {page + 1} de {pageCount}</span>
          <button disabled={page + 1 >= pageCount} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} type="button">Siguiente</button>
        </nav>
      </section>

      <footer className="page__footer">
        <Link to="/archive">Archivo editorial</Link>
        <Link to="/rights">Derechos y procedencia</Link>
      </footer>
    </div>
  )
}

export default AtlasPage
