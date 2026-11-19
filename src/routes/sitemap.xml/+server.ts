// /sitemap.xml, written once at build time: the homepage, About, and every
// published lesson with the date it was last checked against its sources.
import { listArticles } from '#lib/server/articles.ts';
import { sitemapXml } from '#lib/seo.ts';

export const prerender = true;

export function GET() {
	const lessons = listArticles().map((a) => ({
		path: `/learn/${a.category}/${a.slug}`,
		lastmod: a.reviewed
	}));
	return new Response(sitemapXml([{ path: '/' }, { path: '/about' }, ...lessons]), {
		headers: { 'Content-Type': 'application/xml' }
	});
}
