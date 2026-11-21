import type { ReactNode } from 'react'

interface ArtistStageCopyProps {
  readonly kicker: string
  readonly children: ReactNode
}

export function ArtistStageCopy({ kicker, children }: ArtistStageCopyProps) {
  return (
    <div className="artist-stage__copy">
      <p className="page__kicker">{kicker}</p>
      <div>{children}</div>
    </div>
  )
}

