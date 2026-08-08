import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type Signal = {
  phase: number;
  density: number;
  gain: number;
};

function createSignal(phase: number, density: number, gain: number): Signal {
  return { phase, density, gain };
}

export function LabPage() {
  const [phase, setPhase] = useState(2);
  const [density, setDensity] = useState(4);
  const [gain, setGain] = useState(6);
  const signal = useMemo(() => createSignal(phase, density, gain), [phase, density, gain]);
  const output = useMemo(
    () => `V-${String((signal.phase * 31 + signal.density * 17 + signal.gain * 13) % 997).padStart(3, '0')}`,
    [signal],
  );

  return (
    <div className="page page--lab" data-route-root>
      <header className="lab-head">
        <p className="page__eyebrow">NOIACORE / LAB LOCAL</p>
        <h1>La senal se puede repetir.</h1>
        <p>
          Herramienta local y determinista. Los controles no envian datos ni atribuyen significado
          clinico, biografico o predictivo a la salida.
        </p>
      </header>

      <section className="lab-console" aria-labelledby="lab-controls-title">
        <div>
          <p className="page__kicker">ENTRADA</p>
          <h2 id="lab-controls-title">Ajustes de senal</h2>
          <label htmlFor="phase">Fase: {phase}</label>
          <input id="phase" max="8" min="0" onChange={(event) => setPhase(Number(event.target.value))} type="range" value={phase} />
          <label htmlFor="density">Densidad: {density}</label>
          <input id="density" max="8" min="0" onChange={(event) => setDensity(Number(event.target.value))} type="range" value={density} />
          <label htmlFor="gain">Ganancia: {gain}</label>
          <input id="gain" max="8" min="0" onChange={(event) => setGain(Number(event.target.value))} type="range" value={gain} />
        </div>

        <output aria-live="polite" className="lab-output">
          <span>PROCESO / {signal.phase}-{signal.density}-{signal.gain}</span>
          <strong>{output}</strong>
          <span>VOZ = SALIDA</span>
        </output>
      </section>

      <section aria-labelledby="lab-note-title">
        <h2 id="lab-note-title">Regla de lectura</h2>
        <p>La misma entrada genera la misma salida. El resultado es una senal de navegacion, no un diagnostico.</p>
      </section>
      <footer className="page__footer"><Link to="/portal">Llevar la senal al Portal</Link></footer>
    </div>
  );
}

export default LabPage;
