import { AudioLines, Check, Copy, Download, FileImage, Play, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { StudioArtifact, StudioTool } from './studio.types'

interface ArtifactStageProps {
  artifact: StudioArtifact
  tool: StudioTool
}

export function ArtifactStage({ artifact, tool }: ArtifactStageProps) {
  const audioRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number>(0)
  const [copied, setCopied] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => () => {
    window.clearTimeout(timerRef.current)
    void audioRef.current?.close()
  }, [])

  const artifactJson = JSON.stringify({ tool: tool.id, truthMode: 'LOCAL_DETERMINISTIC', artifact }, null, 2)

  const copyArtifact = async () => {
    try {
      await navigator.clipboard.writeText(artifactJson)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const downloadArtifact = () => {
    const url = URL.createObjectURL(new Blob([artifactJson], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${artifact.designation.toLowerCase()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const downloadBlob = (blob: Blob, extension: string) => {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${artifact.designation.toLowerCase()}.${extension}`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const exportImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1600
    canvas.height = 900
    const context = canvas.getContext('2d')
    if (!context) return
    const gradient = context.createRadialGradient(800, 450, 20, 800, 450, 900)
    gradient.addColorStop(0, artifact.palette[0] ?? '#ff435d')
    gradient.addColorStop(0.38, artifact.palette[1] ?? '#48217a')
    gradient.addColorStop(1, '#02030a')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.translate(800, 410)
    context.rotate(Math.PI / 4)
    context.strokeStyle = 'rgba(255,255,255,.72)'
    context.lineWidth = 3
    for (let index = 0; index < 5; index += 1) context.strokeRect(-250 + index * 34, -250 + index * 34, 500 - index * 68, 500 - index * 68)
    context.restore()
    context.fillStyle = '#f4f0e8'
    context.font = '700 58px sans-serif'
    context.fillText(artifact.title.toUpperCase(), 72, 790)
    context.font = '24px monospace'
    context.fillStyle = 'rgba(244,240,232,.72)'
    context.fillText(artifact.designation, 74, 836)
    canvas.toBlob((blob) => { if (blob) downloadBlob(blob, 'png') }, 'image/png')
  }

  const exportWave = () => {
    const sampleRate = 44_100
    const duration = 1.35
    const sampleCount = Math.floor(sampleRate * duration)
    const buffer = new ArrayBuffer(44 + sampleCount * 2)
    const view = new DataView(buffer)
    const writeText = (offset: number, value: string) => Array.from(value).forEach((character, index) => view.setUint8(offset + index, character.charCodeAt(0)))
    writeText(0, 'RIFF')
    view.setUint32(4, 36 + sampleCount * 2, true)
    writeText(8, 'WAVE')
    writeText(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeText(36, 'data')
    view.setUint32(40, sampleCount * 2, true)
    for (let sample = 0; sample < sampleCount; sample += 1) {
      const time = sample / sampleRate
      const step = Math.min(artifact.signal.length - 1, Math.floor(time / duration * artifact.signal.length))
      const frequency = 92 + (artifact.signal[step] ?? 20) * 3.1
      const localPhase = (time % (duration / artifact.signal.length)) / (duration / artifact.signal.length)
      const envelope = Math.sin(Math.PI * Math.min(1, localPhase * 1.8)) * Math.max(0, 1 - localPhase)
      const value = Math.sin(Math.PI * 2 * frequency * time) * envelope * 0.32
      view.setInt16(44 + sample * 2, Math.max(-1, Math.min(1, value)) * 0x7fff, true)
    }
    downloadBlob(new Blob([buffer], { type: 'audio/wav' }), 'wav')
  }

  const stopSignal = () => {
    window.clearTimeout(timerRef.current)
    void audioRef.current?.close()
    audioRef.current = null
    setPlaying(false)
  }

  const playSignal = () => {
    if (playing) {
      stopSignal()
      return
    }
    const AudioContextConstructor = window.AudioContext
    if (!AudioContextConstructor) return
    const context = new AudioContextConstructor()
    audioRef.current = context
    const start = context.currentTime + 0.04
    artifact.signal.forEach((value, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = index % 3 === 0 ? 'triangle' : 'sine'
      oscillator.frequency.value = 92 + value * 3.1
      const noteStart = start + index * 0.13
      gain.gain.setValueAtTime(0.0001, noteStart)
      gain.gain.exponentialRampToValueAtTime(0.07, noteStart + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.18)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(noteStart)
      oscillator.stop(noteStart + 0.2)
    })
    setPlaying(true)
    timerRef.current = window.setTimeout(() => {
      void context.close()
      if (audioRef.current === context) audioRef.current = null
      setPlaying(false)
    }, 1500)
  }

  return (
    <article className="artifact-stage" aria-labelledby="artifact-title">
      <div
        className="artifact-stage__visual"
        style={{
          '--artifact-a': artifact.palette[0],
          '--artifact-b': artifact.palette[1],
          '--artifact-c': artifact.palette[2],
        } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="artifact-stage__core"><i /><i /><i /></div>
        <span>{artifact.designation}</span>
      </div>

      <div className="artifact-stage__reading">
        <p><span>{tool.domainLabel}</span><span>LOCAL / DETERMINISTA</span></p>
        <h3 id="artifact-title">{artifact.title}</h3>
        <p>{artifact.summary}</p>
        <ol>
          {artifact.lines.map((line, index) => <li key={`${artifact.id}-${index}`}><span>0{index + 1}</span>{line}</li>)}
        </ol>
        <div className="artifact-stage__signal" aria-label="Patrón de ocho pasos">
          {artifact.signal.map((value, index) => <i key={`${artifact.id}-signal-${index}`} style={{ height: `${value}%` }} />)}
        </div>
        {artifact.code && <pre><code>{artifact.code}</code></pre>}
        <div className="artifact-stage__actions">
          <button type="button" onClick={playSignal} aria-pressed={playing}>
            {playing ? <Square size={15} /> : <Play size={15} />}{playing ? 'Detener señal' : 'Escuchar señal'}
          </button>
          <button type="button" onClick={copyArtifact}>
            {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar JSON'}
          </button>
          <button type="button" onClick={exportImage}><FileImage size={15} />PNG</button>
          <button type="button" onClick={exportWave}><AudioLines size={15} />WAV</button>
          <button type="button" onClick={downloadArtifact}><Download size={15} />Exportar</button>
        </div>
      </div>
    </article>
  )
}
