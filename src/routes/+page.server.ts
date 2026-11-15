import { buildSystemIndex, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import type { PageServerLoad } from './$types';

// Runs at build time (the page is prerendered), so only this small summary
// reaches the browser, never the lesson code.
export const load: PageServerLoad = () => {
	const articles = listArticles();
	return {
		systems: buildSystemIndex(SYSTEMS, articles),
		// The pages you can open today, in system order, for "Open now".
		open: SYSTEMS.flatMap((system) =>
			articles
				.filter((a) => a.category === system.id)
				.map((a) => ({
					title: a.title,
					summary: a.summary,
					href: `/learn/${a.category}/${a.slug}`,
					steps: a.steps.length,
					cover: a.cover ?? null
				}))
		)
	};
};
