import { describe, expect, it } from 'vitest'
import { getHomeDirection, homeDirections } from './homeDirections'

describe('homeDirections', () => {
  it('exposes five unique canonical visual directions', () => {
    const ids = homeDirections.map((direction) => direction.id)
    expect(ids).toHaveLength(5)
    expect(new Set(ids).size).toBe(5)
  })

  it('keeps quintessence canonical and free of protected media', () => {
    const direction = getHomeDirection('quintessence')
    expect(direction).toMatchObject({ id: 'quintessence', index: '05' })
    expect(direction.image).toBeUndefined()
  })

  it('falls back to the first canonical direction for unknown values', () => {
    expect(getHomeDirection('unknown').id).toBe('ritual')
  })

  it('resolves every canonical direction', () => {
    for (const direction of homeDirections) {
      expect(getHomeDirection(direction.id)).toBe(direction)
    }
  })
})
