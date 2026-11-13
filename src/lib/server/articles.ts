import { pathToRef, type ArticleMeta } from '../content/articles.ts';

/**
 * Server/build-time only. With prerendering, this runs once during `vite build`
 * and its result is serialized into the page as data, so article code never
 * reaches the browser just to render a list of titles.
 */
const metas = import.meta.glob<ArticleMeta>('/src/content/articles/**/*.md', {
	eager: true,
	import: 'metadata'
});

export interface ArticleListing extends ArticleMeta {
	slug: string;
}

export function listArticles(): ArticleListing[] {
	return Object.entries(metas)
		.map(([path, meta]) => ({ ...meta, ...pathToRef(path) }))
		.sort((a, b) => a.order - b.order);
}
