import { useId } from 'react'

interface SingularityCoreProps {
  active: boolean
}

export function SingularityCore({ active }: SingularityCoreProps) {
  const rawId = useId().replace(/:/g, '')
  const diskId = `singularity-disk-${rawId}`
  const glowId = `singularity-glow-${rawId}`

  return (
    <figure className={`singularity-core${active ? ' is-active' : ''}`}>
      <svg aria-labelledby={`${diskId}-title`} role="img" viewBox="0 0 520 380">
        <title id={`${diskId}-title`}>Singularidad roja BELENTANI, núcleo entre realidad y mito</title>
        <defs>
          <radialGradient id={diskId}>
            <stop offset="0" stopColor="#000000" />
            <stop offset=".34" stopColor="#000000" />
            <stop offset=".46" stopColor="#fff1e7" />
            <stop offset=".53" stopColor="#ff294c" />
            <stop offset="1" stopColor="#170008" stopOpacity="0" />
          </radialGradient>
          <filter height="180%" id={glowId} width="180%" x="-40%" y="-40%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g className="singularity-core__field" fill="none" stroke="#f2274c">
          <ellipse cx="260" cy="190" opacity=".16" rx="232" ry="78" />
          <ellipse cx="260" cy="190" opacity=".25" rx="192" ry="62" strokeDasharray="4 14" />
          <ellipse cx="260" cy="190" opacity=".4" rx="150" ry="45" />
        </g>
        <path className="singularity-core__jet" d="M260 20v340" stroke="#ff5269" strokeWidth="2" />
        <ellipse className="singularity-core__blur" cx="260" cy="190" fill="#ff173e" filter={`url(#${glowId})`} opacity=".48" rx="128" ry="34" />
        <g className="singularity-core__disk">
          <ellipse cx="260" cy="190" fill={`url(#${diskId})`} rx="142" ry="104" />
          <ellipse cx="260" cy="190" fill="none" rx="116" ry="26" stroke="#ffabb0" strokeDasharray="42 10 8 14" strokeWidth="3" />
          <circle cx="260" cy="190" fill="#000" r="38" stroke="#ff3253" strokeWidth="2" />
          <text fill="#fff7ef" fontFamily="IBM Plex Mono, monospace" fontSize="27" textAnchor="middle" x="260" y="199">B</text>
        </g>
        <g className="singularity-core__marks" fill="#ff7382" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="2">
          <text x="32" y="48">BELENTANI CORE</text>
          <text textAnchor="end" x="488" y="48">RED STATE / 03</text>
          <text x="32" y="344">REAL EVIDENCE</text>
          <text textAnchor="end" x="488" y="344">MYTH TRANSFORM</text>
        </g>
      </svg>
      <figcaption><span>ENTRELAZADO / NÚCLEO</span><strong>Realidad y símbolo, dos lecturas simultáneas</strong></figcaption>
    </figure>
  )
}
