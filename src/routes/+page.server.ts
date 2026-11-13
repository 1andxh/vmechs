import { listArticles } from '#lib/server/articles.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ articles: listArticles() });
