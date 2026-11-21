const fragmentPositions = [
  ['12%', '26%'], ['33%', '72%'], ['47%', '18%'], ['61%', '58%'], ['76%', '31%'], ['88%', '75%'], ['22%', '48%'],
] as const

interface RitualHuntProps {
  fragments: number[]
  zeroRoom: boolean
  onCollect: (index: number) => void
  onReset: () => void
}
export function RitualHunt({ fragments, zeroRoom, onCollect, onReset }: RitualHuntProps) {
  const complete = fragments.length === fragmentPositions.length

  return (
    <section className="ritual-hunt" aria-labelledby="ritual-hunt-title">
      <div className="studio-section-mark"><span>04</span><span>SIGNAL HUNT</span></div>
      <header>
        <p>MINIJUEGO / MEMORIA LOCAL</p>
        <h2 id="ritual-hunt-title">Siete fragmentos mantienen abierto el portal.</h2>
        <p>Explora el campo con puntero, teclado o lector. El progreso solo permanece en este dispositivo.</p>
      </header>

      <div className="ritual-hunt__field" data-complete={complete || undefined}>
        {fragmentPositions.map(([left, top], index) => (
          <button
            key={left}
            type="button"
            aria-pressed={fragments.includes(index)}
            aria-label={`Fragmento ${index + 1} de 7`}
            style={{ '--fragment-x': left, '--fragment-y': top } as React.CSSProperties}
            onClick={() => onCollect(index)}
          >
            <i aria-hidden="true" />
          </button>
        ))}

        <div className="ritual-hunt__core" aria-live="polite">
          <span>{fragments.length} / 7</span>
          <strong>{complete ? 'CÁMARA OMEGA ABIERTA' : 'FRAGMENTOS ENCONTRADOS'}</strong>
          <p>{complete ? 'No has desbloqueado una descarga: has conectado Origen, Archivo y Retorno.' : 'Las señales visibles también responden al foco.'}</p>
          {complete && <button type="button" onClick={onReset}>Reiniciar constelación</button>}
        </div>
      </div>

      <aside className="zero-room" data-unlocked={zeroRoom || undefined}>
        <span>EASTER EGG / CÁMARA 00</span>
        <strong>{zeroRoom ? 'LA SECUENCIA HA RECORDADO TU NOMBRE.' : 'Una secuencia clásica de diez teclas duerme aquí.'}</strong>
        <p>{zeroRoom ? 'El premio es una regla: ningún mundo merece tu agencia si no te deja salir.' : 'Empieza arriba. Repite. Desciende. Cruza. Confirma.'}</p>
      </aside>
    </section>
  )
}
