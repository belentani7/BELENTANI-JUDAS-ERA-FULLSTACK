import { createReadStream, existsSync } from 'node:fs'
import { appendFile, mkdir, stat } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

type Locale = 'es' | 'en' | 'pt' | 'ca'
type Session = { id: string; locale: Locale; reducedMotion: boolean; createdAt: string }
type RateBucket = { windowStartedAt: number; count: number }

const port = Number.parseInt(process.env.PORT ?? '8787', 10)
const host = process.env.HOST ?? '0.0.0.0'
const runtimeDir = join(process.cwd(), 'runtime')
const distDir = join(process.cwd(), 'dist')
const sessions = new Map<string, Session>()
const rateBuckets = new Map<string, RateBucket>()
const locales: readonly Locale[] = ['es', 'en', 'pt', 'ca']
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT = 60

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
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
}

function setIndexingPolicy(response: ServerResponse, pathname: string): void {
  const sealedRoute = pathname === '/judas' || pathname.startsWith('/judas/')
  const sealedMedia = pathname.startsWith('/media/judas/')
  const internalRoute = ['/atlas', '/noiacore', '/agents', '/prisma'].includes(pathname)
  if (sealedRoute || sealedMedia || internalRoute) {
    response.setHeader('X-Robots-Tag', sealedMedia ? 'noindex, noimageindex, nofollow' : 'noindex, nofollow')
  }
}

function sendJson(response: ServerResponse, statusCode: number, value: unknown, headers?: Record<string, string>): void {
  setSecurityHeaders(response)
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  })
  response.end(JSON.stringify(value))
}

function clientKey(request: IncomingMessage): string {
  return request.socket.remoteAddress ?? 'unknown'
}

function isRateLimited(request: IncomingMessage): boolean {
  const now = Date.now()
  const key = clientKey(request)
  const bucket = rateBuckets.get(key)

  if (!bucket || now - bucket.windowStartedAt >= RATE_WINDOW_MS) {
    rateBuckets.set(key, { windowStartedAt: now, count: 1 })
    return false
  }

  bucket.count += 1
  return bucket.count > RATE_LIMIT
}

setInterval(() => {
  const cutoff = Date.now() - RATE_WINDOW_MS
  for (const [key, bucket] of rateBuckets) {
    if (bucket.windowStartedAt < cutoff) rateBuckets.delete(key)
  }
}, RATE_WINDOW_MS).unref()

function rateLimitResponse(response: ServerResponse): void {
  sendJson(response, 429, { error: 'RATE_LIMITED' }, { 'Retry-After': '60' })
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
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
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
  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok', service: 'belentani-judas-era', time: new Date().toISOString() })
    return true
  }
  if (request.method === 'GET' && pathname === '/api/judas-era') {
    sendJson(response, 200, eraManifest)
    return true
  }
  if (request.method === 'POST' && pathname === '/api/judas-era/session') {
    if (isRateLimited(request)) {
      rateLimitResponse(response)
      return true
    }
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
    if (isRateLimited(request)) {
      rateLimitResponse(response)
      return true
    }
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
  setIndexingPolicy(response, pathname)
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
    const code = error instanceof Error && error.message === 'PAYLOAD_TOO_LARGE' ? 413 : 500
    sendJson(response, code, { error: code === 413 ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_ERROR' })
  }
})

server.listen(port, host, () => console.log(`BELENTANI API http://${host}:${port}`))
