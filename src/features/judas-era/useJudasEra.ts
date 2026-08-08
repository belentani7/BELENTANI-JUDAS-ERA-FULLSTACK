import { useCallback, useEffect, useRef, useState } from 'react'
import { createJudasEraSession, getJudasEraManifest, reportJudasEraSignal } from './judasEraApi'
import { fallbackManifest } from './judasEra.copy'
import type { JudasEraChapterId, JudasEraLocale, JudasEraManifest } from './judasEra.types'

type Connection = 'connecting' | 'live' | 'offline'

export function useJudasEra(locale: JudasEraLocale, reducedMotion: boolean) {
  const [manifest, setManifest] = useState<JudasEraManifest>(fallbackManifest)
  const [connection, setConnection] = useState<Connection>('connecting')
  const sessionId = useRef<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function connect(): Promise<void> {
      try {
        const nextManifest = await getJudasEraManifest(controller.signal)
        const session = await createJudasEraSession(locale, reducedMotion, controller.signal)
        setManifest(nextManifest)
        sessionId.current = session.id
        setConnection('live')
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setConnection('offline')
      }
    }
    void connect()
    return () => controller.abort()
  }, [locale, reducedMotion])

  const reportChapter = useCallback(async (chapter: JudasEraChapterId): Promise<void> => {
    if (!sessionId.current) return
    try {
      await reportJudasEraSignal(sessionId.current, chapter)
    } catch {
      setConnection('offline')
    }
  }, [])

  return { manifest, connection, reportChapter }
}
