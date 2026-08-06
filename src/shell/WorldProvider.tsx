import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { themes, type ThemeDefinition } from '../data/themes'

const STORAGE_KEY = 'belentani-world'

type WorldContextValue = {
  world: ThemeDefinition
  selectWorld: (id: string) => void
  shuffleWorld: () => void
}

const WorldContext = createContext<WorldContextValue | null>(null)

function initialWorldId() {
  const query = new URLSearchParams(window.location.search).get('v')
  if (query && themes.some((theme) => theme.id === query)) return query
  const stored = sessionStorage.getItem(STORAGE_KEY)
  if (stored && themes.some((theme) => theme.id === stored)) return stored
  return themes[Math.floor(Math.random() * themes.length)]?.id ?? themes[0].id
}

export function WorldProvider({ children }: PropsWithChildren) {
  const [worldId, setWorldId] = useState(initialWorldId)
  const world = themes.find((theme) => theme.id === worldId) ?? themes[0]

  const selectWorld = useCallback((id: string) => {
    if (!themes.some((theme) => theme.id === id)) return
    setWorldId(id)
    sessionStorage.setItem(STORAGE_KEY, id)
    const url = new URL(window.location.href)
    url.searchParams.set('v', id)
    window.history.replaceState(null, '', url)
  }, [])

  const shuffleWorld = useCallback(() => {
    const candidates = themes.filter((theme) => theme.id !== worldId)
    const next = candidates[Math.floor(Math.random() * candidates.length)] ?? themes[0]
    selectWorld(next.id)
  }, [selectWorld, worldId])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.world = world.id
    root.dataset.family = world.family
    root.dataset.composition = world.composition
    root.style.setProperty('--world-bg', world.background)
    root.style.setProperty('--world-fg', world.foreground)
    root.style.setProperty('--world-accent', world.accent)
    root.style.setProperty('--world-display-font', `'${world.font.display}', serif`)
    root.style.setProperty('--world-body-font', `'${world.font.body}', sans-serif`)
    const rgb = world.background.match(/[a-f\d]{2}/gi)?.map((channel) => Number.parseInt(channel, 16)) ?? [0, 0, 0]
    const luminance = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 255000
    root.style.colorScheme = luminance > 0.58 ? 'light' : 'dark'
  }, [world])

  const value = useMemo(() => ({ world, selectWorld, shuffleWorld }), [world, selectWorld, shuffleWorld])
  return <WorldContext.Provider value={value}>{children}</WorldContext.Provider>
}

export function useWorld() {
  const context = useContext(WorldContext)
  if (!context) throw new Error('useWorld must be used within WorldProvider')
  return context
}
