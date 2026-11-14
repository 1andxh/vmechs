import type { Component } from 'svelte';
import type { LessonMeta } from './lesson-meta.ts';

/** An article's frontmatter: one definition, shared with the content standard. */
export type ArticleMeta = LessonMeta;

export interface ArticleModule {
	default: Component;
	/** mdsvex exposes the frontmatter as `metadata`. */
	metadata: ArticleMeta;
}

export interface ArticleRef {
	category: string;
	slug: string;
	load: () => Promise<ArticleModule>;
}

/**
 * Client-safe index: lazy imports only. The glob's *keys* (file paths) are
 * known at build time without loading anything, so we get every
 * category/slug for free, and each article's code downloads only when visited.
 *
 * Frontmatter for listings lives in #lib/server/articles.ts instead. Importing
 * it eagerly here would bundle every article into every page that lists them.
 */
const modules = import.meta.glob<ArticleModule>('/src/content/articles/**/*.md');

export function pathToRef(path: string): { category: string; slug: string } {
	const m = path.match(/articles\/([^/]+)\/([^/]+)\.md$/);
	if (!m) throw new Error(`Unexpected article path: ${path}`);
	return { category: m[1], slug: m[2] };
}

export const articleRefs: ArticleRef[] = Object.entries(modules).map(([path, load]) => ({
	...pathToRef(path),
	load
}));

export function findArticle(category: string, slug: string): ArticleRef | undefined {
	return articleRefs.find((a) => a.category === category && a.slug === slug);
}
