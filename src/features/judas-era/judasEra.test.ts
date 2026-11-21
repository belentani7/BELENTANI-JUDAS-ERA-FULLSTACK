import { describe, expect, it } from 'vitest'
import { fallbackManifest, judasEraCopy } from './judasEra.copy'

describe('JUDAS ERA public contract', () => {
  it('keeps the protected work sealed in every locale', () => {
    expect(fallbackManifest.status).toBe('SEALED')
    expect(fallbackManifest.releaseMediaAvailable).toBe(false)
    expect(Object.keys(judasEraCopy)).toEqual(['es', 'en', 'pt', 'ca'])
    for (const copy of Object.values(judasEraCopy)) {
      expect(copy.chapters).toHaveLength(5)
      expect(copy.sealed.length).toBeGreaterThan(10)
    }
  })

  it('uses only approved local visual assets', () => {
    for (const copy of Object.values(judasEraCopy)) {
      for (const chapter of copy.chapters) {
        expect(chapter.image).toMatch(/^\/media\/.*\.(?:png|webp)$/)
        expect(chapter.image).not.toMatch(/\.(?:mp3|wav|m4a|ogg|flac)$/i)
      }
    }
  })
})
