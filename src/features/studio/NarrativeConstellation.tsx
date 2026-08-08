import type { NarrativeChamber } from './studio.types'

const chambers: NarrativeChamber[] = [
  { id: 'origin', index: '00', name: 'ORIGEN', invocation: 'La señal descubre que tiene cuerpo.', x: 13, y: 67 },
  { id: 'mirror', index: '01', name: 'ESPEJO', invocation: 'La identidad aprende a mirarse sin fijarse.', x: 27, y: 29 },
  { id: 'rupture', index: '02', name: 'RUPTURA', invocation: 'El corte se convierte en una puerta.', x: 45, y: 54 },
  { id: 'archive', index: '03', name: 'ARCHIVO', invocation: 'La memoria conserva procedencia y duda.', x: 57, y: 19 },
  { id: 'judas', index: '04', name: 'JUDAS', invocation: 'La obra sellada existe sin entregarse.', x: 69, y: 65 },
  { id: 'omega', index: '05', name: 'OMEGA', invocation: 'Los sistemas separados reconocen un centro.', x: 84, y: 35 },
  { id: 'return', index: '06', name: 'RETORNO', invocation: 'El visitante sale con una conexión nueva.', x: 91, y: 76 },
]

interface NarrativeConstellationProps {
  visited: string[]
  onVisit: (id: string) => void
}
export function NarrativeConstellation({ visited, onVisit }: NarrativeConstellationProps) {
  const active = chambers.find((chamber) => chamber.id === visited.at(-1)) ?? chambers[0]

  return (
    <section className="narrative-constellation" aria-labelledby="constellation-title">
      <div className="studio-section-mark"><span>02</span><span>NARRATIVE GRAPH</span></div>
      <header>
        <p>SIETE CÁMARAS / UNA OBRA CONTINUA</p>
        <h2 id="constellation-title">La historia no avanza en línea recta.</h2>
      </header>

      <div className="constellation-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={chambers.map((chamber) => `${chamber.x},${chamber.y}`).join(' ')} />
          <line x1="27" y1="29" x2="69" y2="65" />
          <line x1="45" y1="54" x2="84" y2="35" />
        </svg>
        <ol>
          {chambers.map((chamber) => (
            <li key={chamber.id} style={{ '--node-x': `${chamber.x}%`, '--node-y': `${chamber.y}%` } as React.CSSProperties}>
              <button
                type="button"
                aria-pressed={active.id === chamber.id}
                data-visited={visited.includes(chamber.id) || undefined}
                onClick={() => onVisit(chamber.id)}
              >
                <span>{chamber.index}</span>
                <strong>{chamber.name}</strong>
              </button>
            </li>
          ))}
        </ol>
        <div className="constellation-reading" aria-live="polite">
          <span>{active.index} / {active.name}</span>
          <p>{active.invocation}</p>
          <small>{visited.length} de {chambers.length} cámaras recordadas en este dispositivo.</small>
        </div>
      </div>
    </section>
  )
}
