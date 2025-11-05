/**
 * Playwright Configuration for Comprehensive E2E Tests
 * YOLO Mode - No compromises, full testing
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests/comprehensive',
  fullyParallel: true, // Run tests in parallel for speed
  forbidOnly: !!process.env.CI, // Fail CI if test.only is used
  retries: process.env.CI ? 2 : 0, // Retry on CI, no retry locally
  workers: process.env.CI ? 1 : undefined, // 1 worker on CI, max on local
  reporter: [
    ['html', { outputFolder: 'e2e-tests/reports/comprehensive' }],
    ['list'],
    ['json', { outputFile: 'e2e-tests/reports/comprehensive-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes to start server
  },
});
