import { buildSystemIndex, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import type { PageServerLoad } from './$types';

// Runs at build time (the page is prerendered), so only this small list of
// titles and links reaches the browser, never the lesson code.
export const load: PageServerLoad = () => ({ systems: buildSystemIndex(SYSTEMS, listArticles()) });
