import { describe, expect, it } from 'vitest'
import { references } from './references'
import { atlasCounts, htmlAtlas } from './htmlAtlas'
import { judasVersions } from './judasVersions'
import { judasChapters, routeDefinitions } from './routes'
import { themes } from './themes'

const topLevelPaths = ['/', '/artist', '/judas', '/archive', '/atlas', '/music', '/film', '/books', '/studio', '/noiacore', '/art-lab', '/agents', '/prisma', '/portal', '/rights', '/contact']

describe('BELENTANI data contract', () => {
  it('contains exactly 20 themes with unique ids and five themes per family', () => {
    expect(themes).toHaveLength(20)
    expect(new Set(themes.map((theme) => theme.id)).size).toBe(20)
    expect(themes.filter((theme) => theme.family === 'ritual')).toHaveLength(5)
    expect(themes.filter((theme) => theme.family === 'spatial')).toHaveLength(5)
    expect(themes.filter((theme) => theme.family === 'signal')).toHaveLength(5)
    expect(themes.filter((theme) => theme.family === 'operational')).toHaveLength(5)
  })

  it('keeps the CSS composition vocabulary distributed across the themes', () => {
    const allowed = ['editorial', 'asymmetric', 'cinematic', 'radial', 'modular']
    expect(themes.every((theme) => allowed.includes(theme.composition))).toBe(true)
    expect(new Set(themes.map((theme) => theme.composition))).toEqual(new Set(allowed))
  })

  it('contains exactly the 16 top-level paths in contract order', () => {
    expect(routeDefinitions).toHaveLength(16)
    expect(new Set(routeDefinitions.map((route) => route.id)).size).toBe(16)
    expect(new Set(routeDefinitions.map((route) => route.path)).size).toBe(16)
    expect(routeDefinitions.map((route) => route.path)).toEqual(topLevelPaths)
    expect(routeDefinitions.every((route) => route.sections.length >= 3)).toBe(true)
  })

  it('contains exactly five JUDAS chapters', () => {
    expect(judasChapters).toHaveLength(5)
    expect(new Set(judasChapters.map((chapter) => chapter.id)).size).toBe(5)
    expect(judasChapters.map((chapter) => chapter.number)).toEqual([1, 2, 3, 4, 5])
  })

  it('catalogs every recovered HTML without exposing source paths', () => {
    expect(htmlAtlas.records).toHaveLength(691)
    expect(htmlAtlas.sourceInstances).toBe(854)
    expect(new Set(htmlAtlas.records.map((record) => record.id)).size).toBe(691)
    expect(new Set(htmlAtlas.records.map((record) => record.digest)).size).toBe(691)
    expect(atlasCounts.structured).toBe(655)
    expect(atlasCounts.private + atlasCounts.review).toBe(691)
    expect(JSON.stringify(htmlAtlas)).not.toMatch(/C:\\\\Users|password|api[_-]?key|token/i)
  })

  it('defines twelve original JUDAS studies and all three reality modes', () => {
    expect(judasVersions).toHaveLength(12)
    expect(new Set(judasVersions.map((version) => version.id)).size).toBe(12)
    expect(new Set(judasVersions.map((version) => version.sourceTitle)).size).toBe(12)
    expect(new Set(judasVersions.map((version) => version.realityMode))).toEqual(new Set(['REAL', 'MITO', 'ENTRELAZADO']))
    expect(judasVersions.every((version) => version.image.startsWith('/media/judas/'))).toBe(true)
  })

  it('catalogs 100 distinct Awwwards sites and all user references', () => {
    expect(references.filter((reference) => reference.source === 'Awwwards')).toHaveLength(100)
    expect(new Set(references.filter((reference) => reference.source === 'Awwwards').map((reference) => reference.url)).size).toBe(100)
    expect(references.filter((reference) => reference.source === 'user-provided')).toHaveLength(10)
    expect(references.every((reference) => reference.url.startsWith('https://'))).toBe(true)
    expect(references.every((reference) => reference.pattern.length > 0 && reference.caution.length > 0)).toBe(true)
  })
})
