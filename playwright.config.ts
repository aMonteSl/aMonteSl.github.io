import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'mobile-360',
      use: { ...devices['iPhone SE'], viewport: { width: 360, height: 740 } },
    },
    {
      name: 'mobile-390',
      use: { ...devices['iPhone 12'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'desktop-hd',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } },
    },
    {
      name: 'desktop-fhd',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'desktop-2k',
      use: { ...devices['Desktop Chrome'], viewport: { width: 2560, height: 1440 } },
    },
    {
      name: 'desktop-4k',
      use: { ...devices['Desktop Chrome'], viewport: { width: 3840, height: 2160 } },
    },
  ],

  webServer: {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
