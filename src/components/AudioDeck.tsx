import { Pause, Play, Volume2 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'

type AudioDeckProps = {
  className?: string
  initialVolume?: number
}

type AudioGraph = {
  context: AudioContext
  master: GainNode
  intervalId: number | null
  oscillators: Set<OscillatorNode>
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value))

function createGraph(volume: number): AudioGraph {
  const context = new AudioContext()
  const master = context.createGain()
  master.gain.value = volume * 0.2
  master.connect(context.destination)
  return { context, master, intervalId: null, oscillators: new Set() }
}

function emitSignal(graph: AudioGraph) {
  const now = graph.context.currentTime
  const oscillator = graph.context.createOscillator()
  const envelope = graph.context.createGain()
  const baseFrequency = 70 + Math.random() * 55
  oscillator.type = Math.random() > 0.56 ? 'sine' : 'triangle'
  oscillator.frequency.setValueAtTime(baseFrequency, now)
  oscillator.frequency.exponentialRampToValueAtTime(baseFrequency * (1.25 + Math.random() * 0.6), now + 0.42)
  envelope.gain.setValueAtTime(0.0001, now)
  envelope.gain.exponentialRampToValueAtTime(0.18, now + 0.035)
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.64)
  oscillator.connect(envelope).connect(graph.master)
  graph.oscillators.add(oscillator)
  oscillator.addEventListener('ended', () => graph.oscillators.delete(oscillator), { once: true })
  oscillator.start(now)
  oscillator.stop(now + 0.68)
}

function stopGraph(graph: AudioGraph) {
  if (graph.intervalId !== null) window.clearInterval(graph.intervalId)
  graph.intervalId = null
  graph.oscillators.forEach((oscillator) => {
    try {
      oscillator.stop()
    } catch {
      // The oscillator may already have completed its short signal.
    }
  })
  graph.oscillators.clear()
}

const deckStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.85rem',
  width: '100%',
  maxWidth: '100%',
  padding: '0.65rem 0',
  color: '#f7f3eb',
  fontFamily: 'inherit',
}

export function AudioDeck({ className, initialVolume = 0.45 }: AudioDeckProps) {
  const [volume, setVolume] = useState(() => clampVolume(initialVolume))
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('Signal muted. Activate to generate sound.')
  const graph = useRef<AudioGraph | null>(null)
  const starting = useRef(false)
  const volumeId = useId()

  useEffect(() => () => {
    if (graph.current) {
      stopGraph(graph.current)
      void graph.current.context.close()
      graph.current = null
    }
  }, [])

  useEffect(() => {
    const current = graph.current
    if (!current) return
    current.master.gain.setTargetAtTime(volume * 0.2, current.context.currentTime, 0.025)
  }, [volume])

  const toggleSignal = async () => {
    if (starting.current) return
    starting.current = true
    try {
      if (playing) {
        if (graph.current) {
          stopGraph(graph.current)
          await graph.current.context.suspend()
        }
        setPlaying(false)
        setMessage('Signal paused.')
        return
      }

      if (!graph.current || graph.current.context.state === 'closed') graph.current = createGraph(volume)
      await graph.current.context.resume()
      emitSignal(graph.current)
      graph.current.intervalId = window.setInterval(() => {
        if (graph.current) emitSignal(graph.current)
      }, 920)
      setPlaying(true)
      setMessage('Generative signal active.')
    } catch {
      setPlaying(false)
      setMessage('Audio could not start in this browser.')
    } finally {
      starting.current = false
    }
  }

  return (
    <div className={className} style={deckStyle} aria-label="Generative signal controls">
      <button
        type="button"
        onClick={() => void toggleSignal()}
        aria-label={playing ? 'Pause generated signal' : 'Play generated signal'}
        aria-pressed={playing}
        title={playing ? 'Pause generated signal' : 'Play generated signal'}
        style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, border: '1px solid #d8b968', borderRadius: '50%', background: 'transparent', color: '#f7f3eb', cursor: 'pointer' }}
      >
        {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
      <Volume2 size={18} aria-hidden="true" color="#d8b968" />
      <label htmlFor={volumeId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)' }}>Signal volume</label>
      <input
        id={volumeId}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-valuetext={`${Math.round(volume * 100)} percent`}
        style={{ width: 'clamp(6rem, 18vw, 10rem)', accentColor: '#d8b968' }}
      />
      <span aria-live="polite" style={{ flex: '1 1 12rem', color: '#c6c0ba', fontSize: '0.86rem' }}>{message}</span>
    </div>
  )
}

export default AudioDeck
