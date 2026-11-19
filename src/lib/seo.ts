/**
 * What search engines and link previews read about a page: its title, a
 * description, its canonical address, and a share image. Pure, so it can be
 * tested; PageMeta.svelte renders it into the page's <head>.
 *
 * Addresses are absolute (SITE.url), because a link preview fetches the image
 * from outside the site.
 */
import { SITE } from './site.ts';

export interface PageInfo {
	/** The page's own title; empty for the homepage. */
	title: string;
	description: string;
	/** The page's path, starting with '/'. */
	path: string;
	/** A share image's path in static/, e.g. /covers/lever.jpg. */
	image: string;
}

const TAGLINE = 'How machines actually work';
const abs = (path: string) => SITE.url + path;

export function pageMeta({ title, description, path, image }: PageInfo) {
	const shareTitle = title || `${SITE.name}: ${TAGLINE}`;
	return {
		title: title ? `${title} · ${SITE.name}` : `${SITE.name} · ${TAGLINE}`,
		description,
		canonical: abs(path),
		og: {
			'og:type': path === '/' ? 'website' : 'article',
			'og:site_name': SITE.name,
			'og:title': shareTitle,
			'og:description': description,
			'og:url': abs(path),
			'og:image': abs(image)
		},
		twitter: { 'twitter:card': 'summary_large_image' }
	};
}

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A sitemap listing pages by full address, with a last-modified date where known (YYYY-MM-DD). */
export function sitemapXml(pages: { path: string; lastmod?: string }[]): string {
	const urls = pages
		.map(
			(p) =>
				`  <url>\n    <loc>${escapeXml(abs(p.path))}</loc>\n` +
				(p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
				'  </url>'
		)
		.join('\n');
	return (
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		`${urls}\n</urlset>\n`
	);
}
