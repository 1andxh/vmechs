import { expect, test, type Page } from '@playwright/test';

const ARTICLE = '/learn/engine/four-stroke-cycle';
const LEVER = '/learn/simple-machines/lever';

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

/**
 * Open the homepage and wait until its engine drawing has drawn its first
 * frame, or the page has settled on no WebGL. Where WebGL is drawn in
 * software (CI), that first frame compiles the renderer's shaders and can hold
 * the page for seconds; clicking during it is what made link tests flaky.
 */
async function openHome(page: Page) {
	await page.goto('/');
	await page
		.locator('.sheet[data-drawn], .lazy[data-status="no-webgl"], .lazy[data-status="error"]')
		.first()
		.waitFor();
}

const slider = (page: Page) => page.getByRole('slider', { name: 'Crank angle' });
const stepButton = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

test('home lists the four-stroke article and links to it', async ({ page }) => {
	await openHome(page);
	await page
		.getByRole('region', { name: 'Open now' })
		.getByRole('link', { name: /how a four-stroke engine works/i })
		.click();
	await expect(page).toHaveURL(ARTICLE);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(/four-stroke/i);
});

test('landing: a drawing sheet whose parts list leads to every engine page, open or on the way', async ({
	page
}) => {
	await openHome(page);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Look inside the machine.');
	const parts = page.getByRole('list', { name: 'Parts of the engine' }).getByRole('listitem');
	await expect(parts).toHaveCount(5);
	// The open page is a link; the planned ones say they're on the way, and aren't links.
	await expect(
		parts.first().getByRole('link', { name: /pistons and crankshaft/i })
	).toHaveAttribute('href', ARTICLE);
	await expect(
		page.getByRole('list', { name: 'Parts of the engine' }).getByRole('link')
	).toHaveCount(1);
	await expect(parts.nth(1)).toContainText('Valvetrain: camshaft and timing · on the way');
	// The title block counts the whole plan, every machine and mechanism.
	await expect(page.locator('.block')).toContainText('3 of 35');
	// Pointing at a part lights it.
	await parts.nth(1).hover();
	await expect(parts.nth(1)).toHaveClass(/lit/);
	// The drawing itself carries no numbers or labels.
	await expect(page.locator('.draw a, .draw .pin')).toHaveCount(0);
});

test('landing: a part in the list opens its page', async ({ page }) => {
	await openHome(page);
	await page.getByRole('link', { name: /pistons and crankshaft/i }).click();
	await expect(page).toHaveURL(ARTICLE);
});

test('landing: "Open now" features the newest page; machines and mechanisms show everything planned', async ({
	page
}) => {
	await page.goto('/');
	// The newest page is featured first; the rest follow in a list.
	const items = page.getByRole('region', { name: 'Open now' }).getByRole('article');
	// Newest first, by publication date: the lever, then gears, then the four-stroke engine.
	await expect(items).toHaveCount(3);
	await expect(items.first()).toContainText('Newest');
	await expect(items.first()).toContainText('Simple machines · 5 steps');
	await expect(items.first().getByRole('link', { name: 'The lever' })).toHaveAttribute(
		'href',
		LEVER
	);
	await expect(items.nth(1)).toContainText('Transmission · 5 steps');
	await expect(items.nth(2)).toContainText('Engine · 4 steps');
	await expect(items.nth(2)).not.toContainText('Newest');
	await expect(
		items.nth(2).getByRole('link', { name: /how a four-stroke engine works/i })
	).toHaveAttribute('href', ARTICLE);

	// Machines: one card each, with its open pages as links.
	const machines = page.getByRole('region', { name: 'Machines' });
	const machine = (name: string) =>
		machines.getByRole('article').filter({ has: page.getByRole('heading', { name, exact: true }) });
	await expect(machines.getByRole('article')).toHaveCount(3);
	await expect(machine('Car')).toContainText('2 open of 19 planned');
	await expect(
		machine('Car').getByRole('link', { name: /how a four-stroke engine works/i })
	).toHaveAttribute('href', ARTICLE);
	await expect(machine('Simple machines')).toContainText('1 open of 6 planned');
	await expect(machine('Simple machines').getByRole('link', { name: 'The lever' })).toHaveAttribute(
		'href',
		LEVER
	);
	// a machine with an open page shows its picture
	await expect(machine('Simple machines').locator('img')).toHaveAttribute(
		'src',
		'/covers/lever.jpg'
	);
	await expect(machine('Clocks and watches')).toContainText('4 planned');
	await expect(machine('Clocks and watches').getByRole('link')).toHaveCount(0);
	// Mechanisms: each says where it's found; one with an open page links to it.
	const mechanisms = page.getByRole('region', { name: 'Mechanisms' });
	const mech = (name: string) => mechanisms.getByRole('listitem').filter({ hasText: name });
	await expect(mech('Gears and gear ratios').getByRole('link')).toHaveAttribute(
		'href',
		'/learn/transmission/gears'
	);
	await expect(mech('Gears and gear ratios')).toContainText('Found in Car, Clock, Bicycle');
	await expect(mech('Escapement').getByRole('link')).toHaveCount(0);
});

test('landing: fits a 320px phone with no console errors', async ({ page }) => {
	const errors = trackErrors(page);
	await page.setViewportSize({ width: 320, height: 700 });
	await openHome(page);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
	expect(errors).toEqual([]);
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

	test('the sheet ends with sources, the review date and a prefilled "Report a mistake" link', async ({
		page
	}) => {
		await openArticle(page);
		await page.getByRole('button', { name: 'All 4 steps' }).click();
		const accuracy = page.getByRole('region', { name: 'Sources and accuracy' });
		await expect(accuracy).toContainText('Last reviewed');
		await expect(accuracy).toContainText('Internal Combustion Engine Fundamentals');
		const href = await accuracy
			.getByRole('link', { name: 'Report a mistake' })
			.getAttribute('href');
		const url = new URL(href!);
		expect(url.pathname).toBe('/1andxh/vmechs/issues/new');
		expect(url.searchParams.get('template')).toBe('report-a-mistake.yml');
		expect(url.searchParams.get('lesson')).toMatch(/\/learn\/engine\/four-stroke-cycle$/);
	});
});

test('clicking a step plays its range, then stops inside it', async ({ page }) => {
	await openArticle(page);
	await stepButton(page, 'Compression').click();
	await expect(stepButton(page, 'Compression')).toHaveAttribute('aria-current', 'step');
	// At 120°/s a 180° stroke takes ~1.5 s, but each frame advances at most 0.1 s
	// (so a background tab doesn't jump). On a slow, software-rendered CI machine
	// that stretches the stroke well past 5 s (seen: 337° after 5 s, still
	// playing). This test checks where it parks, not how fast, so wait generously.
	await expect(page.getByRole('button', { name: 'Play' })).toBeVisible({ timeout: 20_000 });
	const angle = Number(await slider(page).inputValue());
	expect(angle).toBeGreaterThanOrEqual(359);
	expect(angle).toBeLessThanOrEqual(360);
	await expect(stepButton(page, 'Compression')).toHaveAttribute('aria-current', 'step');
});
