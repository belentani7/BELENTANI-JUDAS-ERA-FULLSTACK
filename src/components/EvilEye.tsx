import { useId } from 'react'

interface EvilEyeProps {
  active: boolean
}

export function EvilEye({ active }: EvilEyeProps) {
  const rawId = useId()
  const gradientId = `eye-gradient-${rawId.replace(/:/g, '')}`
  const glowId = `eye-glow-${rawId.replace(/:/g, '')}`

  return (
    <figure className={`evil-eye${active ? ' is-active' : ''}`}>
      <svg aria-labelledby={`${gradientId}-title`} role="img" viewBox="0 0 420 420">
        <title id={`${gradientId}-title`}>Ojo de JUDAS, símbolo mitológico animado</title>
        <defs>
          <radialGradient id={gradientId}>
            <stop offset="0" stopColor="#fff7ed" />
            <stop offset="0.24" stopColor="#ff7a70" />
            <stop offset="0.58" stopColor="#e20b35" />
            <stop offset="1" stopColor="#250009" />
          </radialGradient>
          <filter height="180%" id={glowId} width="180%" x="-40%" y="-40%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="evil-eye__orbits" fill="none">
          <circle cx="210" cy="210" r="184" />
          <circle cx="210" cy="210" r="154" strokeDasharray="2 11" />
          <path d="M62 210c46-90 97-135 148-135s102 45 148 135c-46 90-97 135-148 135S108 300 62 210Z" />
        </g>
        <g className="evil-eye__lid" filter={`url(#${glowId})`}>
          <path d="M72 210c42-63 88-95 138-95s96 32 138 95c-42 63-88 95-138 95S114 273 72 210Z" fill="rgba(5,0,3,.94)" stroke="#f2274c" strokeWidth="3" />
          <path d="M88 210c38-42 79-63 122-63s84 21 122 63c-38 42-79 63-122 63S126 252 88 210Z" fill={`url(#${gradientId})`} />
        </g>
        <g className="evil-eye__iris">
          <circle cx="210" cy="210" fill="none" r="55" stroke="#ffb1a7" strokeDasharray="4 8" />
          <circle cx="210" cy="210" fill="#050003" r="31" />
          <circle cx="198" cy="194" fill="#ffffff" opacity=".92" r="7" />
        </g>
        <path className="evil-eye__key" d="M210 285v68m0-1 17 17m-17-17-17 17" fill="none" stroke="#f2274c" strokeLinecap="round" strokeWidth="3" />
        <g className="evil-eye__ticks" stroke="#ff6d7e">
          <path d="M210 8v20M210 392v20M8 210h20M392 210h20" />
          <path d="m68 68 14 14m256 256 14 14M68 352l14-14m256-256 14-14" />
        </g>
      </svg>
      <figcaption><span>MITO / OJO DE JUDAS</span><strong>Orientación conservada</strong></figcaption>
    </figure>
  )
}
