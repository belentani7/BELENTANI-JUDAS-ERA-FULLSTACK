import { describe, expect, it } from 'vitest'
import { getHomeDirection, homeDirections } from './homeDirections'

describe('homeDirections', () => {
  it('exposes five unique visual directions', () => {
    const ids = homeDirections.map((direction) => direction.id)
    expect(ids).toHaveLength(5)
    expect(new Set(ids).size).toBe(5)
  })

  it('keeps quintessence canonical and free of protected media', () => {
    const direction = getHomeDirection('quintessence')
    expect(direction).toMatchObject({ id: 'quintessence', index: '05' })
    expect(direction.image).toBeUndefined()
  })

  it('ignores prototype directions outside the explicit laboratory', () => {
    expect(getHomeDirection('ritual').id).toBe('quintessence')
  })

  it('resolves all prototypes inside the explicit laboratory', () => {
    expect(getHomeDirection('ritual', true).id).toBe('ritual')
    expect(getHomeDirection('unknown', true).id).toBe('quintessence')
  })
})
