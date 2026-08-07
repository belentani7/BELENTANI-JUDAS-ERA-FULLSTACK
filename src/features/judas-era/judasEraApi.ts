import type { JudasEraChapterId, JudasEraLocale, JudasEraManifest, JudasEraSession } from './judasEra.types'

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`API_${response.status}`)
  return response.json() as Promise<T>
}

export async function getJudasEraManifest(signal: AbortSignal): Promise<JudasEraManifest> {
  const response = await fetch('/api/judas-era', { headers: { Accept: 'application/json' }, signal })
  return readJson<JudasEraManifest>(response)
}

export async function createJudasEraSession(locale: JudasEraLocale, reducedMotion: boolean, signal: AbortSignal): Promise<JudasEraSession> {
  const response = await fetch('/api/judas-era/session', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ locale, reducedMotion }), signal,
  })
  return readJson<JudasEraSession>(response)
}

export async function reportJudasEraSignal(sessionId: string, chapter: JudasEraChapterId): Promise<void> {
  const response = await fetch('/api/judas-era/signal', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, chapter }), keepalive: true,
  })
  if (!response.ok) throw new Error(`API_${response.status}`)
}
