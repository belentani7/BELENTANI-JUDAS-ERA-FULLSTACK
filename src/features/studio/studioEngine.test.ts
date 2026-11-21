import { describe, expect, it } from 'vitest'
import { runStudioTool } from './studioEngine'
import { studioDomains, studioTools } from './toolCatalog'

describe('BELENTANI studio', () => {
  it('exposes exactly one hundred unique local instruments', () => {
    expect(studioTools).toHaveLength(100)
    expect(new Set(studioTools.map((tool) => tool.id))).toHaveProperty('size', 100)
    expect(studioTools.every((tool) => tool.local)).toBe(true)
    expect(studioTools.every((tool) => tool.truthMode === 'LOCAL_DETERMINISTIC' && tool.network === 'never')).toBe(true)
  })

  it('keeps ten instruments in every domain', () => {
    expect(studioDomains).toHaveLength(10)
    for (const domain of studioDomains) {
      expect(studioTools.filter((tool) => tool.domain === domain.id)).toHaveLength(10)
    }
  })

  it('produces deterministic artifacts and responds to a changed seed', () => {
    const tool = studioTools[0]
    const first = runStudioTool(tool, 'diamante vivo', 8)
    expect(runStudioTool(tool, 'diamante vivo', 8)).toEqual(first)
    expect(runStudioTool(tool, 'archivo vivo', 8).id).not.toBe(first.id)
    expect(first.palette).toHaveLength(5)
    expect(first.signal).toHaveLength(8)
  })
})
