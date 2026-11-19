// /robots.txt, written at build time from SITE.url, so the sitemap's address
// changes with the site's in one place.
import { SITE } from '#lib/site.ts';

export const prerender = true;

export function GET() {
	return new Response(
		`# allow crawling everything\nUser-agent: *\nDisallow:\n\nSitemap: ${SITE.url}/sitemap.xml\n`,
		{
			headers: { 'Content-Type': 'text/plain' }
		}
	);
}
