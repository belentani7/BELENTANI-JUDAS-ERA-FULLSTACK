import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 2,
  timeout: 45_000,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', trace: 'retain-on-failure' },
  webServer: [
    { command: 'bun run dev:api', url: 'http://127.0.0.1:8787/api/health', reuseExistingServer: true },
    { command: 'bun run dev:web --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  ],
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
})
