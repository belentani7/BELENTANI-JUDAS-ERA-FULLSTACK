import type { ReactNode } from 'react'

interface ArtistSectionTitleProps {
  readonly kicker: string
  readonly title: string
  readonly children: ReactNode
}

export function ArtistSectionTitle({ kicker, title, children }: ArtistSectionTitleProps) {
  return (
    <div className="artist-section-title">
      <p className="page__kicker">{kicker}</p>
      <h2>{title}</h2>
      <div className="artist-section-title__body">{children}</div>
    </div>
  )
}

