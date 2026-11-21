import { useEffect, useState } from 'react'

const STORAGE_KEY = 'belentani-studio-memory-v1'
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

interface StudioMemory {
  visited: string[]
  fragments: number[]
  zeroRoom: boolean
}
const emptyMemory: StudioMemory = { visited: [], fragments: [], zeroRoom: false }

function readMemory(): StudioMemory {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '') as Partial<StudioMemory>
    const visited = Array.isArray(parsed.visited)
      ? parsed.visited.filter((value): value is string => typeof value === 'string')
      : []
    const fragments = Array.isArray(parsed.fragments)
      ? parsed.fragments.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < 7)
      : []
    return {
      visited: [...new Set(visited)],
      fragments: [...new Set(fragments)].sort((left, right) => left - right),
      zeroRoom: parsed.zeroRoom === true,
    }
  } catch {
    return emptyMemory
  }
}

function writeMemory(memory: StudioMemory) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory))
  } catch {
    // Keep the current session usable when storage is unavailable.
  }
}

export function useStudioMemory() {
  const [memory, setMemory] = useState<StudioMemory>(readMemory)

  useEffect(() => {
    writeMemory(memory)
  }, [memory])

  useEffect(() => {
    let cursor = 0
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      cursor = key === KONAMI[cursor] ? cursor + 1 : key === KONAMI[0] ? 1 : 0
      if (cursor !== KONAMI.length) return
      cursor = 0
      setMemory((current) => ({ ...current, zeroRoom: true }))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const visit = (id: string) => {
    setMemory((current) => ({
      ...current,
      visited: [...current.visited.filter((visitedId) => visitedId !== id), id],
    }))
  }

  const collect = (index: number) => {
    setMemory((current) => current.fragments.includes(index) ? current : { ...current, fragments: [...current.fragments, index].sort() })
  }

  const resetFragments = () => setMemory((current) => ({ ...current, fragments: [] }))

  return { ...memory, visit, collect, resetFragments }
}
