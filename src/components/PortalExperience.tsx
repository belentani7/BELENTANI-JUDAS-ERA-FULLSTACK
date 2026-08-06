import { Archive, AudioLines, Eye, KeyRound, ScanFace, type LucideIcon } from 'lucide-react'
import { useId, useRef, useState, type CSSProperties } from 'react'

export type PortalIdentity = {
  id: string
  label: string
  description: string
  color: string
}

type PortalExperienceProps = {
  identities?: readonly PortalIdentity[]
  onSelect?: (identity: PortalIdentity) => void
  storageKey?: string
}

const defaultIdentities: readonly PortalIdentity[] = [
  { id: 'pedro', label: 'Pedro / Roca', description: 'Entrar por la persistencia.', color: '#ef6179' },
  { id: 'marcos', label: 'Marcos / Cronista', description: 'Entrar por el relato.', color: '#e7b85c' },
  { id: 'santos', label: 'Santos / Antena', description: 'Entrar por la escucha.', color: '#82bdd8' },
  { id: 'belentani', label: 'Belentani / Artefacto', description: 'Entrar por la transformacion.', color: '#a883d8' },
  { id: 'human', label: 'The Human / Interfaz', description: 'Entrar por el encuentro.', color: '#82c98b' },
]

const iconById: Record<string, LucideIcon> = {
  pedro: KeyRound,
  marcos: Archive,
  santos: AudioLines,
  belentani: Eye,
  human: ScanFace,
}

const styles: Record<string, CSSProperties> = {
  section: { width: '100%', background: '#151218', color: '#f7f3eb', padding: 'clamp(2rem, 7vw, 6rem) clamp(1rem, 5vw, 5rem)', fontFamily: 'inherit' },
  header: { maxWidth: 780, marginBottom: '2.25rem' },
  eyebrow: { margin: 0, color: '#d8b968', fontSize: '0.78rem', fontWeight: 700, letterSpacing: 0, textTransform: 'uppercase' },
  heading: { margin: '0.45rem 0 0', fontSize: '3rem', fontWeight: 500, lineHeight: 1.05 },
  list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9.5rem, 1fr))', gap: 'clamp(0.75rem, 2vw, 1.5rem)', maxWidth: 1100 },
  status: { margin: '1.5rem 0 0', color: '#c6c0ba', fontSize: '0.95rem' },
}

function getStoredProgress(storageKey: string, identityIds: readonly string[]) {
  if (typeof window === 'undefined') return new Set<string>()
  try {
    const value = window.localStorage.getItem(storageKey)
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? new Set(parsed.filter((id): id is string => typeof id === 'string' && identityIds.includes(id))) : new Set<string>()
  } catch {
    return new Set<string>()
  }
}

export function PortalExperience({ identities = defaultIdentities, onSelect, storageKey = 'belentani-portal-progress' }: PortalExperienceProps) {
  const [activeId, setActiveId] = useState(() => identities[0]?.id ?? '')
  const [visited, setVisited] = useState<Set<string>>(() => getStoredProgress(storageKey, identities.map((identity) => identity.id)))
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const descriptionId = useId()

  const selectIdentity = (identity: PortalIdentity) => {
    setActiveId(identity.id)
    setVisited((current) => {
      const next = new Set(current).add(identity.id)
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]))
      } catch {
        // Local progress remains available for this session when storage is unavailable.
      }
      return next
    })
    onSelect?.(identity)
  }

  const moveFocus = (index: number, direction: number) => {
    const nextIndex = (index + direction + identities.length) % identities.length
    const next = identities[nextIndex]
    if (next) selectIdentity(next)
    buttons.current[nextIndex]?.focus()
  }

  return (
    <section style={styles.section} aria-labelledby={`${descriptionId}-title`}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>Portal</p>
        <h2 id={`${descriptionId}-title`} style={styles.heading}>Cinco identidades, cinco entradas</h2>
      </div>
      <div style={styles.list} role="list" aria-describedby={descriptionId}>
        {identities.map((identity, index) => {
          const Icon = iconById[identity.id] ?? KeyRound
          const isActive = identity.id === activeId
          const isVisited = visited.has(identity.id)
          return (
            <button
              key={identity.id}
              ref={(element) => { buttons.current[index] = element }}
              type="button"
              role="listitem"
              aria-pressed={isActive}
              aria-label={`${identity.label}. ${identity.description}${isVisited ? ' Visitada.' : ''}`}
              onClick={() => selectIdentity(identity)}
              onPointerEnter={(event) => { if (event.pointerType !== 'touch') selectIdentity(identity) }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); moveFocus(index, 1) }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); moveFocus(index, -1) }
                if (event.key === 'Home') {
                  event.preventDefault()
                  const first = identities[0]
                  buttons.current[0]?.focus()
                  if (first) selectIdentity(first)
                }
                if (event.key === 'End') {
                  event.preventDefault()
                  const lastIndex = identities.length - 1
                  const last = identities[lastIndex]
                  buttons.current[lastIndex]?.focus()
                  if (last) selectIdentity(last)
                }
              }}
              style={{
                appearance: 'none',
                minHeight: 188,
                border: `1px solid ${isActive ? identity.color : '#403945'}`,
                borderRadius: 0,
                background: isActive ? '#241f29' : 'transparent',
                color: '#f7f3eb',
                cursor: 'pointer',
                padding: '1rem',
                textAlign: 'left',
                boxShadow: isActive ? `inset 0 -3px 0 ${identity.color}` : 'none',
                transition: 'background 180ms ease, border-color 180ms ease, transform 180ms ease',
              }}
            >
              <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: '50%', background: identity.color, color: '#17131b', marginBottom: '1.6rem' }}>
                <Icon size={22} strokeWidth={1.8} />
              </span>
              <span style={{ display: 'block', fontSize: '1.05rem', fontWeight: 700 }}>{identity.label}</span>
              <span style={{ display: 'block', marginTop: '0.4rem', color: '#c6c0ba', fontSize: '0.9rem', lineHeight: 1.4 }}>{identity.description}</span>
            </button>
          )
        })}
      </div>
      <p id={descriptionId} style={styles.status} aria-live="polite">
        {visited.size} de {identities.length} identidades abiertas.
      </p>
    </section>
  )
}

export default PortalExperience
