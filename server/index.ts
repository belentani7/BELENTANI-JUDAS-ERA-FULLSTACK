import { createReadStream, existsSync } from 'node:fs'
import { appendFile, mkdir, stat } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

type Locale = 'es' | 'en' | 'pt' | 'ca'
type Session = { id: string; locale: Locale; reducedMotion: boolean; createdAt: string }

const port = Number.parseInt(process.env.PORT ?? '8787', 10)
const host = process.env.HOST ?? '0.0.0.0'
const runtimeDir = join(process.cwd(), 'runtime')
const distDir = join(process.cwd(), 'dist')
const sessions = new Map<string, Session>()
const requestWindows = new Map<string, { count: number; resetAt: number }>()
const locales: readonly Locale[] = ['es', 'en', 'pt', 'ca']

const eraManifest = {
  title: 'JUDAS',
  status: 'SEALED',
  releaseMediaAvailable: false,
  locales,
  chapters: ['threshold', 'artifact', 'debt', 'transmutation', 'return'],
  updatedAt: '2026-08-07T00:00:00.000Z',
} as const

const mimeTypes: Readonly<Record<string, string>> = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2',
}

function setSecurityHeaders(response: ServerResponse): void {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('X-Frame-Options', 'DENY')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self'; worker-src 'self' blob:")
}

function sendJson(response: ServerResponse, statusCode: number, value: unknown): void {
  setSecurityHeaders(response)
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(value))
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 8_192) throw new Error('PAYLOAD_TOO_LARGE')
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new Error('INVALID_JSON')
  }
}

function acceptsRequest(request: IncomingMessage): boolean {
  const key = request.socket.remoteAddress ?? 'unknown'
  const now = Date.now()
  const current = requestWindows.get(key)
  if (!current || now >= current.resetAt) {
    requestWindows.set(key, { count: 1, resetAt: now + 60_000 })
    return true
  }
  current.count += 1
  return current.count <= 60
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
}

async function recordEvent(value: Record<string, unknown>): Promise<void> {
  await mkdir(runtimeDir, { recursive: true })
  await appendFile(join(runtimeDir, 'judas-era-events.ndjson'), `${JSON.stringify(value)}\n`, 'utf8')
}

async function handleApi(request: IncomingMessage, response: ServerResponse, pathname: string): Promise<boolean> {
  if (request.method === 'POST' && pathname.startsWith('/api/') && !acceptsRequest(request)) {
    sendJson(response, 429, { error: 'RATE_LIMITED' })
    return true
  }
  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok', service: 'belentani-judas-era', time: new Date().toISOString() })
    return true
  }
  if (request.method === 'GET' && pathname === '/api/judas-era') {
    sendJson(response, 200, eraManifest)
    return true
  }
  if (request.method === 'POST' && pathname === '/api/judas-era/session') {
    const body = await readJson(request)
    if (!isRecord(body) || !isLocale(body.locale) || typeof body.reducedMotion !== 'boolean') {
      sendJson(response, 400, { error: 'INVALID_SESSION_INPUT' })
      return true
    }
    const session: Session = {
      id: randomUUID(), locale: body.locale, reducedMotion: body.reducedMotion, createdAt: new Date().toISOString(),
    }
    if (sessions.size >= 1_000) sessions.delete(sessions.keys().next().value ?? '')
    sessions.set(session.id, session)
    sendJson(response, 201, session)
    return true
  }
  if (request.method === 'POST' && pathname === '/api/judas-era/signal') {
    const body = await readJson(request)
    const sessionId = isRecord(body) && typeof body.sessionId === 'string' ? body.sessionId : ''
    const chapter = isRecord(body) && typeof body.chapter === 'string' ? body.chapter : ''
    if (!sessions.has(sessionId) || !eraManifest.chapters.includes(chapter as (typeof eraManifest.chapters)[number])) {
      sendJson(response, 400, { error: 'INVALID_SIGNAL' })
      return true
    }
    await recordEvent({ sessionId, chapter, at: new Date().toISOString() })
    sendJson(response, 202, { accepted: true })
    return true
  }
  return false
}

async function serveStatic(response: ServerResponse, pathname: string, headOnly: boolean): Promise<void> {
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const candidate = resolve(distDir, requested)
  const candidateRelative = relative(distDir, candidate)
  let filePath = candidateRelative.startsWith('..') || isAbsolute(candidateRelative) ? join(distDir, 'index.html') : candidate
  if (!existsSync(filePath) || (await stat(filePath)).isDirectory()) filePath = join(distDir, 'index.html')
  setSecurityHeaders(response)
  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
    'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  if (headOnly) response.end()
  else createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
    if (await handleApi(request, response, url.pathname)) return
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(response, 405, { error: 'METHOD_NOT_ALLOWED' })
      return
    }
    if (!existsSync(distDir)) {
      sendJson(response, 404, { error: 'WEB_BUILD_NOT_FOUND', action: 'Run bun run build' })
      return
    }
    await serveStatic(response, url.pathname, request.method === 'HEAD')
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    const code = message === 'PAYLOAD_TOO_LARGE' ? 413 : message === 'INVALID_JSON' ? 400 : 500
    const responseError = code === 413 ? 'PAYLOAD_TOO_LARGE' : code === 400 ? 'INVALID_JSON' : 'INTERNAL_ERROR'
    sendJson(response, code, { error: responseError })
  }
})

server.listen(port, host, () => console.log(`BELENTANI API http://${host}:${port}`))
