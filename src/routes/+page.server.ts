import { buildSystemIndex, MACHINES, MECHANISMS, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import type { PageServerLoad } from './$types';

/** A machine's picture, once it has one (static/covers/), with its size. */
const COVERS: Record<string, { src: string; width: number; height: number }> = {
	car: { src: '/covers/car.svg', width: 600, height: 150 },
	'simple-machines': { src: '/covers/lever.jpg', width: 1280, height: 860 }
};

// Runs at build time (the page is prerendered), so only this small summary
// reaches the browser, never the lesson code.
export const load: PageServerLoad = () => {
	const articles = listArticles();
	const systems = buildSystemIndex(SYSTEMS, articles);
	return {
		systems,
		// Each machine with how much of it is planned and which pages are open.
		machines: MACHINES.map((m) => {
			const pages = systems.filter((s) => s.group === m.id).flatMap((s) => s.lessons);
			return {
				id: m.id,
				name: m.name,
				blurb: m.blurb,
				cover: COVERS[m.id] ?? null,
				planned: pages.length,
				open: pages.flatMap((p) => (p.href ? [{ title: p.title, href: p.href }] : []))
			};
		}),
		// Each mechanism with where it's found, and its page once that's open.
		mechanisms: MECHANISMS.map((m) => {
			const page = systems
				.find((s) => s.id === m.page.section)
				?.lessons.find((l) => l.slug === m.page.slug);
			return { id: m.id, name: m.name, foundIn: m.foundIn, href: page?.href ?? null };
		}),
		// The pages you can open today, newest first, for "Open now" (it features
		// the first). Pages published the same day stay in system order.
		open: SYSTEMS.flatMap((system) =>
			articles
				.filter((a) => a.category === system.id)
				.map((a) => ({
					system: system.name,
					published: a.published,
					title: a.title,
					summary: a.summary,
					href: `/learn/${a.category}/${a.slug}`,
					steps: a.steps.length,
					cover: a.cover ?? null
				}))
		).sort((a, b) => b.published.localeCompare(a.published))
	};
};
