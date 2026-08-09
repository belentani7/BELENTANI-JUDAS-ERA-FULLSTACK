import { describe, expect, it } from 'vitest'
import { getHomeDirection, homeDirections } from './homeDirections'

describe('homeDirections', () => {
  it('exposes five unique visual directions', () => {
    const ids = homeDirections.map((direction) => direction.id)
    expect(ids).toHaveLength(5)
    expect(new Set(ids).size).toBe(5)
  })

  it('resolves quintessence without protected media', () => {
    const direction = getHomeDirection('quintessence')
    expect(direction).toMatchObject({ id: 'quintessence', index: '05' })
    expect(direction.image).toBeUndefined()
  })

  it('falls back to ritual for unknown input', () => {
    expect(getHomeDirection('unknown').id).toBe('ritual')
  })
})
