/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

const ci = !!process.env.CI;

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}',
	// A stray test.only would silently skip the rest of the suite in CI.
	forbidOnly: ci,
	// No retries, on purpose: a flaky test should fail loudly, not pass on a retry.
	retries: 0,
	reporter: ci ? [['github'], ['list']] : 'list',
	// Every browser engine a reader might use. WebKit stands in for Safari,
	// which is also the engine behind every browser on iPhone. The iPhone 15
	// preset runs WebKit (its defaultBrowserType), at phone size with touch.
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
		{ name: 'iphone', use: { ...devices['iPhone 15'] } }
	]
});
