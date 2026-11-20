import { buildSystemIndex, MACHINES, MECHANISMS, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import type { PageServerLoad } from './$types';

// Runs at build time (the page is prerendered), so only this small summary
// reaches the browser, never the lesson code.
export const load: PageServerLoad = () => {
	const articles = listArticles();
	const systems = buildSystemIndex(SYSTEMS, articles);
	return {
		systems,
		// Each machine with how much of it is planned and which pages are open.
		machines: MACHINES.map((m) => {
			const own = systems.filter((s) => s.group === m.id);
			const pages = own.flatMap((s) => s.lessons);
			// A machine made of one system has that system's section page, once it
			// has an open page (the car spans several systems, so it has none).
			const section = own.length === 1 && own[0].available > 0 ? `/learn/${own[0].id}` : null;
			return {
				id: m.id,
				name: m.name,
				blurb: m.blurb,
				colour: m.colour,
				href: section,
				planned: pages.length,
				open: pages.flatMap((p) => (p.href ? [{ title: p.title, href: p.href }] : []))
			};
		}),
		// Each mechanism with its page, once that's open.
		mechanisms: MECHANISMS.map((m) => {
			const page = systems
				.find((s) => s.id === m.page.section)
				?.lessons.find((l) => l.slug === m.page.slug);
			return { name: m.name, href: page?.href ?? null };
		}),
		// The pages you can open today, newest first, for "Open now" (it features
		// the first). On the same day, the later page in the plan comes first, so
		// the one just added is featured: the list is reversed from plan order,
		// and the sort is stable, so ties keep that reversed order.
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
		)
			.reverse()
			.sort((a, b) => b.published.localeCompare(a.published))
	};
};
