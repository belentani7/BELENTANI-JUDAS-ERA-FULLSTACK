import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type ArchiveItem = {
  id: string;
  title: string;
  type: 'texto' | 'imagen' | 'audio' | 'proceso';
  state: 'lectura' | 'referencia' | 'sin verificar';
  description: string;
};

const items: readonly ArchiveItem[] = [
  { id: 'a-01', title: 'Clave dorada', type: 'texto', state: 'lectura', description: 'Fragmento editorial sobre umbral y permiso.' },
  { id: 'a-02', title: 'Campo de ruido', type: 'imagen', state: 'referencia', description: 'Imagen de proceso, sin atribucion biografica.' },
  { id: 'a-03', title: 'Voz en bruto', type: 'audio', state: 'sin verificar', description: 'Registro pendiente de contexto y autorizacion.' },
  { id: 'a-04', title: 'Diagrama de salida', type: 'proceso', state: 'lectura', description: 'Esquema del protocolo entrada, datos y voz.' },
  { id: 'a-05', title: 'Cinco umbrales', type: 'texto', state: 'referencia', description: 'Indice de navegacion para JUDAS.' },
  { id: 'a-06', title: 'Restos de luz', type: 'imagen', state: 'sin verificar', description: 'Material visual conservado con estado editorial abierto.' },
];

const filters = ['todo', 'texto', 'imagen', 'audio', 'proceso'] as const;
type Filter = (typeof filters)[number];

export function ArchivePage() {
  const [filter, setFilter] = useState<Filter>('todo');
  const [activeId, setActiveId] = useState<string | null>(null);
  const filteredItems = useMemo(
    () => items.filter((item) => filter === 'todo' || item.type === filter),
    [filter],
  );
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  return (
    <div className="page page--archive" data-route-root>
      <header className="archive-head">
        <p className="page__eyebrow">BELENTANI / ARCHIVO</p>
        <h1>Materiales con estado visible.</h1>
        <p>
          Este indice organiza referencias y piezas de lectura. El estado editorial indica el grado
          de contexto disponible; no confirma autoria, fecha o biografia.
        </p>
      </header>

      <section aria-labelledby="archive-filter-title">
        <h2 id="archive-filter-title" className="visually-hidden">Filtrar archivo</h2>
        <fieldset className="archive-filters">
          <legend>Tipo de material</legend>
          {filters.map((value) => (
            <label key={value}>
              <input
                checked={filter === value}
                name="archive-filter"
                onChange={() => setFilter(value)}
                type="radio"
                value={value}
              />
              {value === 'todo' ? 'Todo' : value}
            </label>
          ))}
        </fieldset>
      </section>

      <section aria-live="polite" aria-label="Resultados del archivo">
        <p className="archive-count">{filteredItems.length} materiales</p>
        <ul className="archive-grid">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button aria-haspopup="dialog" onClick={() => setActiveId(item.id)} type="button">
                <span className="archive-item__type">{item.type}</span>
                <strong>{item.title}</strong>
                <span>{item.state}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {activeItem && (
        <div aria-labelledby="archive-lightbox-title" aria-modal="true" className="archive-lightbox" role="dialog">
          <div className="archive-lightbox__backdrop" onClick={() => setActiveId(null)} />
          <article className="archive-lightbox__content">
            <button aria-label="Cerrar detalle" onClick={() => setActiveId(null)} type="button">Cerrar</button>
            <p className="page__kicker">{activeItem.type} / {activeItem.state}</p>
            <h2 id="archive-lightbox-title">{activeItem.title}</h2>
            <p>{activeItem.description}</p>
            <p>Estado de contexto: {activeItem.state}.</p>
          </article>
        </div>
      )}

      <footer className="page__footer"><Link to="/artist">Volver al artista</Link></footer>
    </div>
  );
}

export default ArchivePage;
