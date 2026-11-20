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
 * Open the homepage. It has no 3D (ADR 0016) and its links are plain links,
 * so it can be used as soon as it has loaded.
 */
async function openHome(page: Page) {
	await page.goto('/');
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

test('landing: a moving headline and no 3D model', async ({ page }) => {
	await openHome(page);
	// The gear and the piston inside the headline are decoration; it reads as plain words.
	await expect(page.getByRole('heading', { level: 1, name: 'How things move.' })).toBeVisible();
	await expect(page.locator('h1 [aria-hidden="true"] svg')).toHaveCount(1);
	// No model on the homepage: no 3D canvas, not even a placeholder for one.
	await expect(page.locator('canvas, .lazy')).toHaveCount(0);
});

test('landing: no link into one machine at the top; the slogan signs off the footer', async ({
	page
}) => {
	await openHome(page);
	// The engine gets its own page; the top of the homepage doesn't send you to it.
	await expect(page.getByRole('link', { name: /engine run/i })).toHaveCount(0);
	// (the footer sits inside <main>, so it isn't a contentinfo landmark; find it by tag)
	await expect(page.locator('footer')).toContainText('Mechanics made easy.');
});

test('landing: posters show every machine and the mechanisms; "Open now" features the newest page', async ({
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

	// One poster per machine, plus one for the mechanisms, each listing its open pages.
	const posters = page.getByRole('region', { name: 'Machines and mechanisms' });
	const poster = (name: string) =>
		posters.getByRole('article').filter({ has: page.getByRole('heading', { name, exact: true }) });
	await expect(posters.getByRole('article')).toHaveCount(4);
	await expect(poster('Car')).toContainText('17 more on the way');
	await expect(
		poster('Car').getByRole('link', { name: /how a four-stroke engine works/i })
	).toHaveAttribute('href', ARTICLE);
	await expect(poster('Simple machines')).toContainText('5 more on the way');
	await expect(poster('Simple machines').getByRole('link', { name: 'The lever' })).toHaveAttribute(
		'href',
		LEVER
	);
	await expect(poster('Clocks and watches')).toContainText('4 on the way');
	await expect(poster('Clocks and watches').getByRole('link')).toHaveCount(0);
	await expect(poster('Mechanisms').getByRole('link')).toHaveCount(1);
	await expect(
		poster('Mechanisms').getByRole('link', { name: 'Gears and gear ratios' })
	).toHaveAttribute('href', '/learn/transmission/gears');
	await expect(poster('Mechanisms')).toContainText('7 more on the way');
	// The posters are type only: no pictures, no icons.
	await expect(posters.locator('img, svg')).toHaveCount(0);
	// Pointing at a poster deepens its tint.
	const tint = () => poster('Car').evaluate((el) => getComputedStyle(el).backgroundColor);
	const atRest = await tint();
	await poster('Car').hover();
	await expect.poll(tint).not.toBe(atRest);
	// The dividers line up: posters side by side start their lists at the same height
	// (four in a row on a laptop, two on a tablet, one on a phone).
	const byRow = new Map<number, Set<number>>();
	for (const card of await posters.getByRole('article').all()) {
		const row = Math.round((await card.boundingBox())!.y);
		const list = Math.round((await card.getByRole('list').boundingBox())!.y);
		byRow.set(row, (byRow.get(row) ?? new Set()).add(list));
	}
	for (const lists of byRow.values()) expect(lists.size).toBe(1);
});

test('the About page says what vmechs is, how accuracy works, and how to report a mistake', async ({
	page
}) => {
	await page.goto('/');
	// the header and the footer both link to About
	await page.getByRole('link', { name: 'About', exact: true }).first().click();
	await expect(page).toHaveURL('/about');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Machines are easier to understand when you can watch them move.'
	);
	for (const h of [
		'Who it’s for',
		'How a page works',
		'How accuracy is handled',
		'Spotted a mistake?'
	])
		await expect(page.getByRole('heading', { level: 2, name: h })).toBeVisible();
	// the report link opens the repo's issue form
	await expect(page.getByRole('link', { name: 'Report a mistake' })).toHaveAttribute(
		'href',
		/\/issues\/new\?template=report-a-mistake\.yml$/
	);
	await expect(page.getByText('It never diagnoses a fault')).toBeVisible();
});

test('a lesson 3D view has a text alternative for screen readers', async ({ page }) => {
	await page.goto(LEVER);
	await page.locator('.lesson[data-hydrated]').waitFor();
	await expect(
		page.getByRole('img', { name: 'The lever, in 3D. The subtitles describe each step.' })
	).toBeVisible();
	// the lever's numbers stay outside the picture, so they can still be read
	await expect(page.getByRole('term').first()).toHaveText('Effort');
});

test('every page tells search engines and link previews what it is', async ({ page }) => {
	const head = async (path: string) => {
		await page.goto(path);
		const attr = (sel: string, a: string) => page.locator(sel).first().getAttribute(a);
		return {
			canonical: await attr('link[rel="canonical"]', 'href'),
			image: await attr('meta[property="og:image"]', 'content'),
			title: await attr('meta[property="og:title"]', 'content'),
			description: await attr('meta[name="description"]', 'content')
		};
	};
	// a lesson shares its own cover, at a full address
	const lever = await head(LEVER);
	expect(lever.canonical).toMatch(/^https:\/\/.+\/learn\/simple-machines\/lever$/);
	expect(lever.image).toMatch(/^https:\/\/.+\/covers\/lever\.jpg$/);
	expect(lever.title).toBe('The lever');
	expect(lever.description).toContain('A bar and a pivot');
	// the homepage and About have their own titles and descriptions too
	for (const path of ['/', '/about']) {
		const h = await head(path);
		expect(h.canonical, path).toMatch(/^https:\/\//);
		expect(h.image, path).toMatch(/^https:\/\/.+\.jpg$/);
		expect(h.description, path).toBeTruthy();
	}
});

test('the sitemap lists every page, and robots.txt points to it', async ({ request }) => {
	const xml = await (await request.get('/sitemap.xml')).text();
	for (const path of ['/', '/about', ARTICLE, '/learn/transmission/gears', LEVER])
		expect(xml, path).toMatch(new RegExp(`<loc>https://[^<]+${path.replace(/\//g, '\\/')}</loc>`));
	expect(xml.match(/<url>/g)).toHaveLength(5);
	expect(await (await request.get('/robots.txt')).text()).toMatch(
		/^Sitemap: https:\/\/.+\/sitemap\.xml$/m
	);
});

test('an unknown address says so, with a 404 status and a way back', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page isn't here.");
	// the way back, and the open pages, one click away
	const home = page.getByRole('link', { name: 'Back to the start' });
	await expect(home).toHaveAttribute('href', '/');
	await expect(page.getByRole('link', { name: 'The lever' })).toHaveAttribute('href', LEVER);
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

	test("a highlighted word that names a part is shown in the part's colour", async ({ page }) => {
		await openArticle(page);
		const word = () => page.locator('.subtitle .hl');
		await stepButton(page, 'Intake').click();
		await expect(word()).toHaveText('intake valve');
		await expect(word()).toHaveCSS('color', 'rgb(44, 98, 180)'); // blue, like the valve
		await stepButton(page, 'Power').click();
		await expect(word()).toHaveText('piston');
		await expect(word()).toHaveCSS('color', 'rgb(42, 122, 64)'); // green, like the piston
		await stepButton(page, 'Compression').click();
		await expect(word()).toHaveText('squeezes');
		await expect(word()).toHaveCSS('color', 'rgb(180, 80, 14)'); // not a part: the accent
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

	test('"Watch this step" closes the sheet and plays that step on stage', async ({ page }) => {
		await openArticle(page);
		await page.getByRole('button', { name: 'All 4 steps' }).click();
		// each button names its step, so a screen reader can tell them apart
		const watch = page.getByRole('dialog').getByRole('button', { name: /^Watch / });
		await expect(watch).toHaveText(Array(4).fill('Watch this step'));
		await page.getByRole('button', { name: 'Watch this step: Exhaust', exact: true }).click();
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
