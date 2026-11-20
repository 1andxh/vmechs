// /sitemap.xml, written once at build time: the homepage, About, every
// section page, and every published lesson with the date it was last checked
// against its sources.
import { buildSystemIndex, sectionIds, SYSTEMS } from '#lib/content/systems.ts';
import { listArticles } from '#lib/server/articles.ts';
import { sitemapXml } from '#lib/seo.ts';

export const prerender = true;

export function GET() {
	const articles = listArticles();
	const sections = sectionIds(buildSystemIndex(SYSTEMS, articles)).map((id) => ({
		path: `/learn/${id}`
	}));
	const lessons = articles.map((a) => ({
		path: `/learn/${a.category}/${a.slug}`,
		lastmod: a.reviewed
	}));
	return new Response(sitemapXml([{ path: '/' }, { path: '/about' }, ...sections, ...lessons]), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
