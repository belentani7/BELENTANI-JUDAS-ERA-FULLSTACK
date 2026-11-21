import type { ReactNode } from 'react'

interface ArtistSceneFrameProps {
  readonly className?: string
  readonly children: ReactNode
}

export function ArtistSceneFrame({ className = '', children }: ArtistSceneFrameProps) {
  return <div className={`artist-stage__scene ${className}`.trim()}>{children}</div>
}

