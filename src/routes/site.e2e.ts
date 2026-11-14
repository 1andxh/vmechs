import { expect, test, type Page } from '@playwright/test';

const ARTICLE = '/learn/engine/four-stroke-cycle';

/** Collect console errors and uncaught exceptions for the whole test. */
function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	page.on('pageerror', (e) => errors.push(e.message));
	return errors;
}

/**
 * Open the lesson and wait until Svelte has hydrated it. The page is
 * prerendered HTML, so it's visible before its controls work; interacting
 * earlier races hydration.
 */
async function openArticle(page: Page) {
	await page.goto(ARTICLE);
	await page.locator('.lesson[data-hydrated]').waitFor();
}

const slider = (page: Page) => page.getByRole('slider', { name: 'Crank angle' });
const stepButton = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

test('home lists the four-stroke article and links to it', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: /how a four-stroke engine works/i }).click();
	await expect(page).toHaveURL(ARTICLE);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/four-stroke/i);
});

// Covers both paths: with WebGL the 3D canvas must mount; without it (e.g.
// headless Firefox on a GPU-less CI machine) the fallback message must show.
// Which path ran is recorded as an annotation, so lost WebGL coverage is visible.
test('article mounts the 3D view, or its fallback, without console errors', async ({ page }) => {
	const errors = trackErrors(page);
	await openArticle(page);
	const hasWebGL = await page.evaluate(() => {
		const c = document.createElement('canvas');
		return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
	});
	test
		.info()
		.annotations.push({ type: 'webgl', description: hasWebGL ? 'available' : 'unavailable' });
	if (hasWebGL) {
		await expect(page.locator('.lazy[data-status="ready"] canvas')).toBeVisible({
			timeout: 15_000
		});
		await page.waitForTimeout(500); // let a few frames render
	} else {
		await expect(page.getByText('3D view unavailable in this browser.')).toBeVisible();
	}
	expect(errors).toEqual([]);
});

test('prerendered HTML ships the controls disabled until hydration', async ({ request }) => {
	const html = await (await request.get(ARTICLE)).text();
	expect(html).toMatch(/<input[^>]*type="range"[^>]*disabled/);
	expect(html).toMatch(/<button[^>]*class="all[^"]*"[^>]*disabled/);
});

test('the stage fits a phone screen without sideways scrolling', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 700 });
	await openArticle(page);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test.describe('with reduced motion', () => {
	test.use({ reducedMotion: 'reduce' });

	test('does not autoplay', async ({ page }) => {
		await openArticle(page);
		await page.waitForTimeout(600);
		await expect(slider(page)).toHaveValue('0');
	});

	test('clicking a timeline step jumps to its middle, marks it current, and shows its subtitle', async ({
		page
	}) => {
		await openArticle(page);
		await stepButton(page, 'Power').click();
		await expect(slider(page)).toHaveValue('450');
		await expect(stepButton(page, 'Power')).toHaveAttribute('aria-current', 'step');
		await expect(stepButton(page, 'Intake')).not.toHaveAttribute('aria-current', 'step');
		await expect(page.getByText('drives the piston down')).toBeVisible();
	});

	test('the subtitle follows the playhead when scrubbing', async ({ page }) => {
		await openArticle(page);
		await slider(page).fill('600');
		await expect(page.getByText('Exhaust · step 4 of 4')).toBeVisible();
		await expect(page.getByText('pushes the burnt gas out')).toBeVisible();
	});

	test('"All 4 steps" opens the sheet, which marks the step that is on stage', async ({ page }) => {
		await openArticle(page);
		await stepButton(page, 'Power').click();
		await page.getByRole('button', { name: 'All 4 steps' }).click();
		const sheet = page.getByRole('dialog', { name: 'How a four-stroke engine works' });
		await expect(sheet).toBeVisible();
		await expect(sheet.locator('section[aria-current="step"]')).toContainText('Power');
		await expect(sheet.getByText('On stage now')).toBeVisible();
	});

	// Opened with the keyboard: that's who focus return is for. (Safari doesn't
	// focus a button on mouse click, so a mouse-opened sheet has nothing to
	// return focus to there, and mouse users don't need it.)
	test('Esc closes the sheet and puts focus back on its button', async ({ page }) => {
		await openArticle(page);
		const open = page.getByRole('button', { name: 'All 4 steps' });
		await open.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).toBeHidden();
		await expect(open).toBeFocused();
		await expect(open).toHaveAttribute('aria-expanded', 'false');
	});

	test('"Watch this stroke" closes the sheet and plays that step on stage', async ({ page }) => {
		await openArticle(page);
		await page.getByRole('button', { name: 'All 4 steps' }).click();
		await page.getByRole('button', { name: 'Watch this stroke' }).nth(3).click();
		await expect(page.getByRole('dialog')).toBeHidden();
		await expect(slider(page)).toHaveValue('630');
	});
});

test('clicking a step plays its range, then stops inside it', async ({ page }) => {
	await openArticle(page);
	await stepButton(page, 'Compression').click();
	await expect(stepButton(page, 'Compression')).toHaveAttribute('aria-current', 'step');
	// Normal speed is 120°/s, so a 180° stroke takes ~1.5 s. Wait for it to park.
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible({ timeout: 5_000 });
	const angle = Number(await slider(page).inputValue());
	expect(angle).toBeGreaterThanOrEqual(359);
	expect(angle).toBeLessThanOrEqual(360);
	await expect(stepButton(page, 'Compression')).toHaveAttribute('aria-current', 'step');
});
