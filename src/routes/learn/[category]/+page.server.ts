import { error } from '@sveltejs/kit';
import { buildSystemIndex, sectionGroups, sectionIds, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

// A section page for every system with at least one open lesson, written at
// build time like the rest of the site. Systems with nothing open yet have no
// page, so their address is a 404.
export const prerender = true;
export const entries: EntryGenerator = () =>
	sectionIds(buildSystemIndex(SYSTEMS, listArticles())).map((category) => ({ category }));

export const load: PageServerLoad = ({ params }) => {
	const articles = listArticles();
	const row = buildSystemIndex(SYSTEMS, articles).find(
		(r) => r.id === params.category && r.available > 0
	);
	const system = SYSTEMS.find((s) => s.id === params.category);
	if (!row || !system) error(404, 'Section not found');

	// Each page in the plan, numbered in teaching order, with what its lesson
	// says about itself once it's open.
	const lessons = new Map(articles.filter((a) => a.category === row.id).map((a) => [a.slug, a]));
	const number = new Map(row.lessons.map((l, i) => [l.slug, i + 1]));
	const groups = sectionGroups(system, row).map((g) => ({
		name: g.name,
		lessons: g.lessons.map((l) => {
			const lesson = lessons.get(l.slug);
			return {
				n: number.get(l.slug)!,
				slug: l.slug,
				title: l.title,
				href: l.href,
				summary: lesson?.summary ?? null,
				cover: lesson?.cover ?? null,
				ima: lesson?.ima ?? null
			};
		})
	}));
	const covers = groups.flatMap((g) => g.lessons.flatMap((l) => (l.cover ? [l.cover] : [])));

	return {
		system: {
			id: row.id,
			name: row.name,
			blurb: row.blurb,
			open: row.available,
			planned: row.lessons.length
		},
		groups,
		cover: covers[0] ?? null,
		// students get "The numbers" in every lesson that states its formula
		withNumbers: groups.some((g) => g.lessons.some((l) => l.ima))
	};
};
