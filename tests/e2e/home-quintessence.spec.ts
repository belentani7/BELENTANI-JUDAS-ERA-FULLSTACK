import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('canonical Quintessence Home', () => {
  test('keeps the public route canonical and the prototype selector private to the lab query', async ({ page }) => {
    await page.goto('/?direction=ritual', { waitUntil: 'domcontentloaded' })

    const home = page.locator('.cinematic-home')
    await expect(home).toHaveAttribute('data-direction', 'quintessence')
    await expect(home).toHaveAttribute('data-experience-state', 'dormancy')
    await expect(page.locator('.cinematic-home__directions')).toHaveCount(0)

    await page.goto('/?lab=home&direction=ritual')
    await expect(home).toHaveAttribute('data-direction', 'ritual')
    await expect(page.getByRole('navigation', { name: 'Laboratorio de prototipos Home' }).getByRole('button')).toHaveCount(5)
  })

  test('exposes one semantic entity and the Reunir, Dispersar and Entrar actions', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: 'BELENTANI' })).toBeVisible()
    await expect(page.locator('figure.cinematic-home__entity')).toHaveCount(1)
    await expect(page.getByText('Entidad heroica de quinta materia', { exact: false })).toHaveCount(1)
    await expect(page.getByRole('button', { name: 'Reunir', exact: true })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Dispersar', exact: true })).toBeDisabled()
    await expect(page.getByRole('link', { name: 'Entrar', exact: true })).toHaveAttribute('href', '/artist')
  })

  test('passes the focused Axe audit', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-route-root]')).toBeVisible({ timeout: 30_000 })
    const results = await new AxeBuilder({ page }).include('[data-route-root]').analyze()
    expect(results.violations).toEqual([])
  })

  test('moves through memory, convergence, shockwave and threshold from keyboard', async ({ page }) => {
    await page.goto('/')
    const home = page.locator('.cinematic-home')
    const gather = page.getByRole('button', { name: 'Reunir', exact: true })

    await expect(home).toHaveAttribute('data-experience-state', 'dormancy', { timeout: 30_000 })
    await page.evaluate(() => {
      const target = document.querySelector('.cinematic-home')
      const state = window as Window & { __quintessenceStates?: string[] }
      state.__quintessenceStates = [target?.getAttribute('data-experience-state') ?? 'missing']
      if (!target) return
      new MutationObserver(() => {
        const next = target.getAttribute('data-experience-state')
        if (next) state.__quintessenceStates?.push(next)
      }).observe(target, { attributes: true, attributeFilter: ['data-experience-state'] })
    })
    await gather.focus()
    await expect(home).toHaveAttribute('data-experience-state', 'memory')
    await page.keyboard.press('Enter')
    await expect(home).toHaveAttribute('data-experience-state', 'threshold', { timeout: 6_000 })
    const visited = await page.evaluate(() => (window as Window & { __quintessenceStates?: string[] }).__quintessenceStates ?? [])
    expect(visited).toEqual(expect.arrayContaining(['dormancy', 'memory', 'convergence', 'shockwave', 'threshold']))
  })

  test('uses the equivalent static threshold when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const home = page.locator('.cinematic-home')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
    await expect(page.locator('.home-artifact-fallback[data-direction="quintessence"]')).toBeVisible()
    await expect(page.locator('.home-artifact-canvas')).toHaveCount(0)
    await page.getByRole('button', { name: 'Reunir', exact: true }).click()
    await expect(home).toHaveAttribute('data-experience-state', 'threshold')
    await expect(page.locator('.cinematic-home__statement')).toContainText('Lo que parecía fragmento era umbral.')
  })

  test('requests no JUDAS or private media on the public Home', async ({ page }) => {
    const protectedRequests: string[] = []
    page.on('request', (request) => {
      if (/\/media\/judas\/|\.(?:mp3|wav|m4a|ogg|flac|mp4|mov)(?:\?|$)/i.test(request.url())) {
        protectedRequests.push(request.url())
      }
    })

    await page.goto('/')
    await expect(page.locator('audio, video, source')).toHaveCount(0)
    expect(protectedRequests).toEqual([])
  })

  test('shows and clears the intentional fallback around WebGL context loss', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop WebGL recovery check')
    await page.goto('/')

    const stage = page.locator('.home-artifact-stage')
    const canvas = stage.locator('canvas')
    await expect(canvas).toBeVisible({ timeout: 30_000 })
    await canvas.dispatchEvent('webglcontextlost')
    await expect(stage).toHaveAttribute('data-context-state', 'lost')
    await expect(stage.locator('.home-artifact-fallback[data-context-lost="true"]')).toBeVisible()
    await canvas.dispatchEvent('webglcontextrestored')
    await expect(stage).toHaveAttribute('data-context-state', 'ready')
    await expect(stage.locator('.home-artifact-fallback')).toHaveCount(0)
  })
})

test('mobile touch reaches convergence without horizontal overflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile touch matrix')
  await page.goto('/')

  await page.getByRole('button', { name: 'Reunir', exact: true }).tap()
  await expect(page.locator('.cinematic-home')).toHaveAttribute('data-gathered', 'true')
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})
