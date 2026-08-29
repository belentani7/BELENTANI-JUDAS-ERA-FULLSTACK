import { inflateSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

const topLevelPaths = [
  '/',
  '/artist',
  '/judas',
  '/archive',
  '/atlas',
  '/music',
  '/film',
  '/books',
  '/studio',
  '/noiacore',
  '/art-lab',
  '/agents',
  '/prisma',
  '/portal',
  '/rights',
  '/contact',
] as const

const representativePaths = ['/', '/artist', '/judas', '/judas/versions', '/archive', '/atlas', '/art-lab', '/portal', '/contact'] as const

function hasVisiblePixelVariation(png: Buffer) {
  const signature = '89504e470d0a1a0a'
  if (png.subarray(0, 8).toString('hex') !== signature) return false

  let width = 0
  let height = 0
  let colorType = 0
  const imageData: Buffer[] = []
  for (let offset = 8; offset + 12 <= png.length;) {
    const length = png.readUInt32BE(offset)
    const type = png.toString('ascii', offset + 4, offset + 8)
    const dataStart = offset + 8
    const dataEnd = dataStart + length
    if (type === 'IHDR') {
      width = png.readUInt32BE(dataStart)
      height = png.readUInt32BE(dataStart + 4)
      colorType = png[dataStart + 9] ?? 0
      if (png[dataStart + 8] !== 8 || (colorType !== 2 && colorType !== 6)) return false
    }
    if (type === 'IDAT') imageData.push(png.subarray(dataStart, dataEnd))
    offset = dataEnd + 4
    if (type === 'IEND') break
  }
  if (!width || !height || imageData.length === 0) return false

  const bytesPerPixel = colorType === 6 ? 4 : 3
  const rowLength = width * bytesPerPixel
  const decoded = inflateSync(Buffer.concat(imageData))
  const pixels = Buffer.alloc(width * height * bytesPerPixel)
  let sourceOffset = 0

  const paeth = (left: number, above: number, upperLeft: number) => {
    const estimate = left + above - upperLeft
    const leftDistance = Math.abs(estimate - left)
    const aboveDistance = Math.abs(estimate - above)
    const upperLeftDistance = Math.abs(estimate - upperLeft)
    if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left
    if (aboveDistance <= upperLeftDistance) return above
    return upperLeft
  }

  for (let row = 0; row < height; row += 1) {
    const filter = decoded[sourceOffset++] ?? 0
    const rowStart = row * rowLength
    const previousRow = rowStart - rowLength
    for (let column = 0; column < rowLength; column += 1) {
      const raw = decoded[sourceOffset++] ?? 0
      const left = column >= bytesPerPixel ? pixels[rowStart + column - bytesPerPixel] ?? 0 : 0
      const above = row > 0 ? pixels[previousRow + column] ?? 0 : 0
      const upperLeft = row > 0 && column >= bytesPerPixel ? pixels[previousRow + column - bytesPerPixel] ?? 0 : 0
      pixels[rowStart + column] = raw + (filter === 1 ? left : filter === 2 ? above : filter === 3 ? Math.floor((left + above) / 2) : filter === 4 ? paeth(left, above, upperLeft) : 0)
    }
  }

  const firstRed = pixels[0] ?? 0
  const firstGreen = pixels[1] ?? 0
  const firstBlue = pixels[2] ?? 0
  let variedPixels = 0
  for (let offset = 0; offset < pixels.length; offset += bytesPerPixel) {
    if (Math.abs((pixels[offset] ?? 0) - firstRed) > 4 || Math.abs((pixels[offset + 1] ?? 0) - firstGreen) > 4 || Math.abs((pixels[offset + 2] ?? 0) - firstBlue) > 4) variedPixels += 1
  }
  return variedPixels > Math.max(25, width * height * 0.001)
}

test.describe('top-level routes', () => {
  for (const path of topLevelPaths) {
    test(`${path} exposes visible route content`, async ({ page }) => {
      await page.goto(path)

      const routeRoot = page.locator('main#main-content [data-route-root]')
      await expect(routeRoot).toBeVisible({ timeout: 30_000 })
      await expect(routeRoot.locator('h1').first()).toBeVisible()
    })
  }
})

test('world selector exposes 20 options and updates html data-world', async ({ page }) => {
  await page.goto('/')

  const selector = page.locator('#world-select')
  await expect(selector).toHaveCount(1)
  await expect(selector.locator('option')).toHaveCount(20)

  const nextWorld = await selector.locator('option').nth(1).getAttribute('value')
  expect(nextWorld).toBeTruthy()
  if (await selector.isVisible()) {
    await selector.selectOption(nextWorld as string)
  } else {
    await selector.evaluate((element, value) => {
      const select = element as HTMLSelectElement
      select.value = value
      select.dispatchEvent(new Event('change', { bubbles: true }))
    }, nextWorld as string)
  }

  await expect.poll(() => page.locator('html').getAttribute('data-world')).toBe(nextWorld)
})

test('home exposes five cinematic directions', async ({ page }) => {
  await page.goto('/?lab=home&direction=ritual')

  const directions = page.locator('.cinematic-home__directions button')
  await expect(directions).toHaveCount(5)
  await directions.nth(4).click()
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-direction', 'quintessence')
  await expect(page).toHaveURL(/direction=quintessence/)
})

test('quintessence reunites five fields into one accessible state', async ({ page }) => {
  await page.goto('/')

  const home = page.locator('.cinematic-home')
  const action = page.locator('.cinematic-home__gather')
  await expect(home).toHaveAttribute('data-direction', 'quintessence')
  await expect(page.locator('.cinematic-home__statement')).toContainText('Cinco materias esperan bajo la superficie.')
  await expect(action).toHaveAccessibleName('Reunir')
  await action.click()
  await expect(home).toHaveAttribute('data-gathered', 'true')
  await expect(home).toHaveAttribute('data-experience-state', 'threshold', { timeout: 4_000 })
  await expect(page.locator('.cinematic-home__statement')).toContainText('Lo que parecía fragmento era umbral.')
  await page.getByRole('button', { name: 'Dispersar', exact: true }).click()
  await expect(home).toHaveAttribute('data-experience-state', 'dormancy')
})

test('home artifact selects WebGL or the intentional mobile fallback', async ({ page }, testInfo) => {
  await page.goto('/?lab=home&direction=portal')

  if (testInfo.project.name === 'mobile-chromium') {
    await expect(page.locator('.home-artifact-fallback[data-direction="portal"]')).toBeVisible()
    await expect(page.locator('.home-artifact-canvas')).toHaveCount(0)
    return
  }

  const canvas = page.locator('.home-artifact-canvas')
  await expect(canvas).toBeVisible({ timeout: 30_000 })
  await expect.poll(async () => hasVisiblePixelVariation(await canvas.screenshot()), { timeout: 30_000, intervals: [100, 250, 500, 1_000] }).toBe(true)
})

test('quintessence keeps a live WebGL scene or its intentional mobile fallback', async ({ page }, testInfo) => {
  await page.goto('/')

  if (testInfo.project.name === 'mobile-chromium') {
    await expect(page.locator('.home-artifact-fallback[data-direction="quintessence"]')).toBeVisible()
    await expect(page.locator('.home-artifact-canvas')).toHaveCount(0)
    return
  }

  const canvas = page.locator('.home-artifact-canvas')
  await expect(canvas).toBeVisible({ timeout: 30_000 })
  await expect.poll(async () => hasVisiblePixelVariation(await canvas.screenshot()), { timeout: 30_000, intervals: [100, 250, 500, 1_000] }).toBe(true)
  await page.getByRole('button', { name: 'Reunir', exact: true }).click()
  await expect.poll(async () => hasVisiblePixelVariation(await canvas.screenshot()), { timeout: 30_000, intervals: [100, 250, 500, 1_000] }).toBe(true)
})

test('mobile home directions remain inside the viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile Home matrix')

  for (const direction of ['ritual', 'archive', 'body', 'portal', 'quintessence']) {
    await page.goto(`/?lab=home&direction=${direction}`)
    await page.evaluate(() => document.fonts.ready)
    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth)
    expect(overflow, `${direction} overflow`).toBeLessThanOrEqual(0)
  }
})

test.describe('layout', () => {
  for (const path of representativePaths) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path === '/' ? '/?v=paper-archive' : `${path}?v=paper-archive`)
      await page.evaluate(() => document.fonts.ready)

      await expect.poll(() => page.evaluate(() => {
        const width = document.documentElement.clientWidth
        const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
        return scrollWidth - width
      })).toBeLessThanOrEqual(0)
    })
  }
})

test('mobile JUDAS keeps all 20 worlds inside the viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile composition matrix')
  await page.goto('/judas?v=paper-archive')
  const worldIds = await page.locator('#world-select option').evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value))
  expect(worldIds).toHaveLength(20)

  for (const worldId of worldIds) {
    await page.goto(`/judas?v=${worldId}`)
    await page.evaluate(() => document.fonts.ready)
    await expect(page.locator('.judas-era__seal')).toBeVisible()
    const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth)
    expect(overflow, `${worldId} overflow`).toBeLessThanOrEqual(0)
  }
})

test('JUDAS does not create an AudioContext before opt-in', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { __belentaniAudioContextCount?: number }
    state.__belentaniAudioContextCount = 0
    const NativeAudioContext = window.AudioContext
    if (!NativeAudioContext) return

    window.AudioContext = new Proxy(NativeAudioContext, {
      construct(target, args, newTarget) {
        state.__belentaniAudioContextCount = (state.__belentaniAudioContextCount ?? 0) + 1
        return Reflect.construct(target, args, newTarget)
      },
    })
  })

  await page.goto('/judas')
  const supported = await page.evaluate(() => typeof window.AudioContext === 'function')
  test.skip(!supported, 'AudioContext is unavailable in this browser')

  await expect.poll(() => page.evaluate(() => {
    const state = window as Window & { __belentaniAudioContextCount?: number }
    return state.__belentaniAudioContextCount ?? 0
  })).toBe(0)
})

test('JUDAS ERA is continuous, localized and requests no protected media', async ({ page }) => {
  const mediaRequests: string[] = []
  page.on('request', (request) => {
    if (/\.(?:mp3|wav|m4a|ogg|flac)(?:\?|$)/i.test(request.url())) mediaRequests.push(request.url())
  })

  await page.goto('/judas?v=black-mirror')
  await expect(page.locator('.judas-era__chapter')).toHaveCount(5)
  await expect(page.locator('.judas-era__wordmark')).toHaveText('JUDAS')
  await expect(page.locator('.judas-era__seal')).toContainText('SELLADA')
  await page.getByRole('button', { name: 'EN', exact: true }).click()
  await expect(page.locator('.judas-era__seal')).toContainText('SEALED WORK')
  expect(mediaRequests).toEqual([])
})

test('JUDAS Version Lab exposes twelve studies and changes the active signal', async ({ page }) => {
  await page.goto('/judas/versions')
  const studies = page.locator('.judas-version-selector button')
  await expect(studies).toHaveCount(12)
  await studies.nth(10).click()
  await expect(page.locator('.judas-study')).toHaveAttribute('data-study', 'field-circle')
  await expect(page).toHaveURL(/study=field-circle/)
  await expect(page.locator('.evil-eye')).toBeVisible()
})

test('HTML Atlas exposes the complete sanitized corpus in bounded pages', async ({ page }) => {
  await page.goto('/atlas')
  await expect(page.locator('.atlas-field')).toBeVisible()
  await expect(page.locator('.atlas-records li')).toHaveCount(48)
  await expect(page.locator('.atlas-browser__head')).toContainText('691 resultados')
  await expect(page.locator('body')).not.toContainText('C:\\Users\\')
})

test('OMEGA Studio exposes one hundred local instruments and deterministic output', async ({ page }) => {
  await page.goto('/art-lab')
  await page.getByRole('button', { name: 'Pausar movimiento' }).click()

  const tools = page.locator('[data-tool-id]')
  await expect(tools).toHaveCount(20)
  await expect(page.locator('.tool-index__heading output')).toHaveText('100 / 100')

  const designation = page.locator('.artifact-stage__visual > span')
  const initialDesignation = await designation.textContent()
  await page.getByRole('button', { name: 'Ejecutar instrumento' }).click()
  await expect(designation).toHaveText(initialDesignation ?? '')

  await page.locator('#studio-seed').fill('archivo que respira')
  await page.getByRole('button', { name: 'Ejecutar instrumento' }).click()
  await expect(designation).not.toHaveText(initialDesignation ?? '')

  await page.locator('#studio-tool-search').fill('OMEGA')
  await expect(page.locator('[data-tool-id]')).toHaveCount(3)
})

test('OMEGA Studio persists narrative and game discoveries locally', async ({ page }) => {
  await page.goto('/art-lab')

  const narrativeNodes = page.locator('.constellation-map ol button')
  const fragments = page.locator('.ritual-hunt__field > button')
  await expect(narrativeNodes).toHaveCount(7)
  await expect(fragments).toHaveCount(7)
  await narrativeNodes.nth(2).click()
  await fragments.nth(4).click()
  await page.reload()

  await expect(narrativeNodes.nth(2)).toHaveAttribute('data-visited', 'true')
  await expect(fragments.nth(4)).toHaveAttribute('aria-pressed', 'true')
  await narrativeNodes.nth(0).click()
  await expect(narrativeNodes.nth(0)).toHaveAttribute('aria-pressed', 'true')
  await narrativeNodes.nth(2).click()
  await expect(narrativeNodes.nth(2)).toHaveAttribute('aria-pressed', 'true')
})

test('OMEGA Studio remains usable when local storage is unavailable', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.addInitScript(() => {
    const nativeSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = function setItem(key, value) {
      if (this === window.localStorage) throw new DOMException('Storage disabled', 'SecurityError')
      return nativeSetItem.call(this, key, value)
    }
  })

  await page.goto('/art-lab')
  const narrativeNode = page.locator('.constellation-map ol button').nth(2)
  const fragment = page.getByRole('button', { name: 'Fragmento 1 de 7' })
  await narrativeNode.click()
  await fragment.click()

  await expect(narrativeNode).toHaveAttribute('data-visited', 'true')
  await expect(fragment).toHaveAttribute('aria-pressed', 'true')
  expect(pageErrors).toEqual([])
})

test('OMEGA Studio creates no audio context before explicit playback', async ({ page }) => {
  await page.addInitScript(() => {
    const state = window as Window & { __studioAudioContextCount?: number }
    state.__studioAudioContextCount = 0
    const NativeAudioContext = window.AudioContext
    if (!NativeAudioContext) return
    window.AudioContext = new Proxy(NativeAudioContext, {
      construct(target, args, newTarget) {
        state.__studioAudioContextCount = (state.__studioAudioContextCount ?? 0) + 1
        return Reflect.construct(target, args, newTarget)
      },
    })
  })
  await page.goto('/art-lab')
  await expect.poll(() => page.evaluate(() => (window as Window & { __studioAudioContextCount?: number }).__studioAudioContextCount ?? 0)).toBe(0)
})

test('OMEGA Studio keeps its core path keyboard-operable and same-origin', async ({ page }) => {
  const consoleErrors: string[] = []
  const externalRequests: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url())
  })

  await page.goto('/art-lab')
  await page.getByRole('button', { name: 'Pausar movimiento' }).click()
  await expect(page.locator('.vite-error-overlay')).toHaveCount(0)
  await expect(page.locator('body')).toContainText('Un estudio completo dentro de un mundo vivo.')

  const imageDomain = page.getByRole('button', { name: 'Imagen', exact: true })
  await imageDomain.focus()
  await page.keyboard.press('Enter')
  await expect(imageDomain).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-tool-id]')).toHaveCount(10)

  const fragment = page.getByRole('button', { name: 'Fragmento 1 de 7' })
  await fragment.focus()
  await page.keyboard.press('Space')
  await expect(fragment).toHaveAttribute('aria-pressed', 'true')
  expect(consoleErrors).toEqual([])
  expect(externalRequests).toEqual([])
})

test('OMEGA Studio exports generated PNG, WAV and a converted local image', async ({ page }) => {
  await page.goto('/art-lab')
  await page.getByRole('button', { name: 'Pausar movimiento' }).click()

  const [pngDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'PNG', exact: true }).click(),
  ])
  expect(pngDownload.suggestedFilename()).toMatch(/\.png$/)

  const [waveDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'WAV', exact: true }).click(),
  ])
  expect(waveDownload.suggestedFilename()).toMatch(/\.wav$/)

  const onePixelPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
  await page.locator('#transmuter-file').setInputFiles({ name: 'relic.png', mimeType: 'image/png', buffer: onePixelPng })
  await page.locator('#transmuter-format').selectOption('image/webp')
  const [convertedDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Convertir y descargar' }).click(),
  ])
  expect(convertedDownload.suggestedFilename()).toBe('relic.webp')
  await expect(page.locator('.image-transmuter__preview')).toContainText('convertido en este dispositivo')
})

test('portal exposes five identities and persists opened progress', async ({ page }) => {
  await page.goto('/portal')

  const identityButtons = page.locator('.portal-stage__experience button[role="listitem"]')
  await expect(identityButtons).toHaveCount(5)

  const progress = page.locator('.portal-stage__experience p[aria-live="polite"]')
  await expect(progress).toContainText('0 de 5')
  await identityButtons.nth(2).click()
  await expect(progress).toContainText('1 de 5')

  await page.reload()
  await expect(identityButtons).toHaveCount(5)
  await expect(progress).toContainText('1 de 5')
})

test.describe('full-stack API', () => {
  test('health and sealed manifest are available', async ({ request }) => {
    const health = await request.get('http://127.0.0.1:8787/api/health')
    expect(health.ok()).toBe(true)
    expect(health.headers()['content-security-policy']).toContain("img-src 'self' data: blob:")
    await expect(health.json()).resolves.toMatchObject({ status: 'ok', service: 'belentani-judas-era' })

    const manifest = await request.get('http://127.0.0.1:8787/api/judas-era')
    expect(manifest.ok()).toBe(true)
    await expect(manifest.json()).resolves.toMatchObject({ title: 'JUDAS', status: 'SEALED', releaseMediaAvailable: false })
  })

  test('session accepts a valid signal and rejects invalid input', async ({ request }) => {
    const invalid = await request.post('http://127.0.0.1:8787/api/judas-era/session', { data: { locale: 'xx', reducedMotion: false } })
    expect(invalid.status()).toBe(400)

    const created = await request.post('http://127.0.0.1:8787/api/judas-era/session', { data: { locale: 'es', reducedMotion: true } })
    expect(created.status()).toBe(201)
    const session = await created.json() as { id: string }

    const signal = await request.post('http://127.0.0.1:8787/api/judas-era/signal', { data: { sessionId: session.id, chapter: 'threshold' } })
    expect(signal.status()).toBe(202)
    await expect(signal.json()).resolves.toEqual({ accepted: true })
  })

  test('malformed JSON is rejected without exposing an internal error', async () => {
    const response = await fetch('http://127.0.0.1:8787/api/judas-era/session', {
      method: 'POST',
      body: '{',
      headers: { 'Content-Type': 'application/json' },
    })
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'INVALID_JSON' })
  })
})
