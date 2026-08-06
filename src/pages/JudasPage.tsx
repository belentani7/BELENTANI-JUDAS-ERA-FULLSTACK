import { lazy, Suspense, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { judasChapters } from '../data/routes';

const AudioDeck = lazy(() => import('../components/AudioDeck').then((module) => ({ default: module.AudioDeck })));

type Chapter = readonly [string, string, string];

const fallbackChapters: readonly Chapter[] = [
  ['I', 'La marca', 'El instante que divide el antes del despues.'],
  ['II', 'La pregunta', 'La version que insiste en no cerrar.'],
  ['III', 'El archivo', 'Lo que permanece incluso fuera de foco.'],
  ['IV', 'La transmutacion', 'Dolor tratado como materia, no como sentencia.'],
  ['V', 'La voz', 'Una salida posible: volver a nombrarse.'],
] as const;

const romanChapterNumbers = ['I', 'II', 'III', 'IV', 'V'] as const;

function getString(record: Record<string, unknown>, keys: readonly string[], fallback: string): string {
  for (const key of keys) if (typeof record[key] === 'string') return record[key];
  return fallback;
}

function readChapters(source: readonly unknown[]): readonly Chapter[] {
  const chapters = source
    .map((chapter, index) => {
      if (Array.isArray(chapter)) {
        const [id, title, description] = chapter;
        return [String(id ?? index + 1), String(title ?? ''), String(description ?? '')] as const;
      }
      if (typeof chapter !== 'object' || chapter === null) return null;
      const record = chapter as Record<string, unknown>;
      return [
        getString(record, ['roman'], romanChapterNumbers[index] ?? String(index + 1)),
        getString(record, ['title', 'label', 'name'], ''),
        getString(record, ['description', 'summary', 'excerpt'], 'Capitulo del recorrido JUDAS.'),
      ] as const;
    })
    .filter((chapter): chapter is Chapter => chapter !== null && Boolean(chapter[1]));
  return chapters.length ? chapters.slice(0, 5) : fallbackChapters;
}

export function JudasPage() {
  const chapters = readChapters(judasChapters as readonly unknown[]);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const panelId = useId();
  const selected = chapters[selectedChapter];

  return (
    <div className="page page--judas" data-route-root>
      <header className="judas-head">
        <p className="page__eyebrow">JUDAS / EXPERIENCIA EN CINCO CAPITULOS</p>
        <h1>La traicion como entrada.</h1>
        <p>
          JUDAS es una lectura de ficcion y simbolo. No establece hechos sobre personas reales ni
          reclama una unica interpretacion.
        </p>
      </header>

      <section className="chapter-reader" aria-labelledby="chapter-title">
        <div role="tablist" aria-label="Capitulos de JUDAS" className="chapter-reader__tabs">
          {chapters.map(([roman, title], index) => (
            <button
              aria-controls={panelId}
              aria-selected={selectedChapter === index}
              id={`chapter-tab-${index}`}
              key={title}
              onClick={() => setSelectedChapter(index)}
              role="tab"
              type="button"
            >
              <span aria-hidden="true">{roman}</span> {title}
            </button>
          ))}
        </div>
        <article
          aria-labelledby={`chapter-tab-${selectedChapter}`}
          className="chapter-reader__panel"
          id={panelId}
          role="tabpanel"
        >
          <p className="page__kicker">CAPITULO {selected[0]}</p>
          <h2 id="chapter-title">{selected[1]}</h2>
          <p>{selected[2]}</p>
          <p>
            La regla del recorrido es simple: observar la herida sin convertirla en prueba,
            transformar la senal sin borrar su procedencia, escuchar lo que surge despues.
          </p>
        </article>
      </section>

      <section aria-labelledby="judas-audio-title">
        <h2 id="judas-audio-title">Escucha de capitulo</h2>
        <Suspense fallback={<p>Preparando audio</p>}>
          <AudioDeck className="judas-audio" />
        </Suspense>
      </section>

      <footer className="page__footer">
        <Link to="/judas/versions">Explorar 12 versiones</Link>
        <Link to="/archive">Ver materiales relacionados</Link>
        <Link to="/portal">Continuar al Portal</Link>
      </footer>
    </div>
  );
}

export default JudasPage;
