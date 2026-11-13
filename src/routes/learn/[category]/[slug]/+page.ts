import { error } from '@sveltejs/kit';
import { articleRefs, findArticle } from '#lib/content/articles.ts';
import type { EntryGenerator, PageLoad } from './$types';

// Tell the static build which /learn/... pages exist.
export const entries: EntryGenerator = () =>
	articleRefs.map(({ category, slug }) => ({ category, slug }));

export const load: PageLoad = async ({ params }) => {
	const ref = findArticle(params.category, params.slug);
	if (!ref) error(404, 'Article not found');
	const mod = await ref.load();
	return { meta: mod.metadata, content: mod.default };
};
