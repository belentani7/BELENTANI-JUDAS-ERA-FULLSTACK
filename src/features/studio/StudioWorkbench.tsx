import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { runStudioTool } from './studioEngine'
import { studioTools } from './toolCatalog'
import type { StudioDomain, StudioTool } from './studio.types'
import { ArtifactStage } from './ArtifactStage'
import { ImageTransmuter } from './ImageTransmuter'
import { ToolIndex } from './ToolIndex'

export function StudioWorkbench() {
  const [selectedTool, setSelectedTool] = useState<StudioTool>(studioTools[0])
  const [activeDomain, setActiveDomain] = useState<StudioDomain | 'all'>('all')
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('un mundo que recuerda al visitante')
  const [intensity, setIntensity] = useState(8)
  const [artifact, setArtifact] = useState(() => runStudioTool(studioTools[0], input, intensity))

  const selectTool = (tool: StudioTool) => {
    setSelectedTool(tool)
    setArtifact(runStudioTool(tool, input, intensity))
  }

  const generate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setArtifact(runStudioTool(selectedTool, input, intensity))
  }

  return (
    <section id="studio-workbench" className="studio-workbench" aria-labelledby="studio-workbench-title">
      <div className="studio-section-mark"><span>03</span><span>CREATIVE ENGINE</span></div>
      <header>
        <p>100 INSTRUMENTOS / 10 MOTORES / CERO RED</p>
        <h2 id="studio-workbench-title">El estudio vive dentro de la obra.</h2>
        <p>
          Cada instrumento ejecuta una receta generativa local y declara su naturaleza. No son cien modelos de IA remotos:
          son cien capacidades reproducibles de imagen, movimiento, sonido, vídeo, lenguaje, código, archivo y mundos.
        </p>
      </header>

      <div className="studio-workbench__machine">
        <ToolIndex
          activeDomain={activeDomain}
          query={query}
          selectedId={selectedTool.id}
          onDomainChange={setActiveDomain}
          onQueryChange={setQuery}
          onSelect={selectTool}
        />

        <div className="studio-workbench__stage">
          <form className="studio-input" onSubmit={generate}>
            <div>
              <span>INSTRUMENTO {String(selectedTool.index).padStart(3, '0')}</span>
              <strong>{selectedTool.name}</strong>
              <small>{selectedTool.description}</small>
            </div>
            <label htmlFor="studio-seed">
              <span>Semilla / intención</span>
              <textarea id="studio-seed" value={input} onChange={(event) => setInput(event.target.value)} rows={3} maxLength={320} />
            </label>
            <label htmlFor="studio-intensity">
              <span>Intensidad {intensity}/10</span>
              <input id="studio-intensity" type="range" min="1" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
            </label>
            <button type="submit"><Sparkles size={17} />Ejecutar instrumento</button>
          </form>
          <ArtifactStage artifact={artifact} tool={selectedTool} />
        </div>
      </div>
      <ImageTransmuter />
    </section>
  )
}
