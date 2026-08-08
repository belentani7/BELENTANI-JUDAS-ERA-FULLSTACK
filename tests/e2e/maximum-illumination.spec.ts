import { expect, test } from '@playwright/test'

test('portal direction exposes an accessible maximum-illumination trigger', async ({ page }) => {
  await page.goto('/?direction=portal')

  const home = page.locator('.cinematic-home')
  const trigger = page.locator('.cinematic-home__illumination')
  await expect(trigger).toBeVisible()
  await expect(trigger).toHaveAccessibleName(/^(Activar iluminación máxima|Iluminación máxima)$/)
  if (await trigger.getAttribute('aria-pressed') === 'false') await trigger.click()
  await expect(trigger).toHaveAttribute('aria-pressed', 'true')
  await expect(trigger).toHaveText('Iluminación máxima')
  await expect(home).toHaveAttribute('data-illuminated', 'true')
})
