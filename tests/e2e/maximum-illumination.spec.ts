import { expect, test } from '@playwright/test'

test('portal direction exposes an accessible maximum-illumination trigger', async ({ page }) => {
  await page.goto('/?lab=home&direction=portal')

  const home = page.locator('.cinematic-home')
  const trigger = page.getByRole('button', { name: /^(Activar iluminación máxima|Iluminación máxima)$/ })
  await expect(trigger).toBeVisible({ timeout: 30_000 })
  if (await trigger.getAttribute('aria-pressed') === 'false') await trigger.click()
  await expect(trigger).toHaveAttribute('aria-pressed', 'true')
  await expect(trigger).toHaveText('Iluminación máxima')
  await expect(home).toHaveAttribute('data-illuminated', 'true')
})
