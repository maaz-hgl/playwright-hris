import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { FullConfig } from "@playwright/test";
import { sendTeamsMessage } from "./utils/teams";

dotenv.config();

export default defineConfig({

 globalTeardown: "./config/playwright-teardown",
  testDir: './tests',
  timeout: 30 * 1000,
  // retries: 1, // retry failed tests
  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { outputFolder: 'reports/my-reports', open: 'on-failure' }],
    ['json', { outputFile: 'reports/result.json' }],
    ['junit', { outputFile: 'reports/Junit-result.xml' }],
  
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
