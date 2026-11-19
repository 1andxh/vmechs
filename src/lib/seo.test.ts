import { describe, it, expect } from 'vitest';
import { pageMeta, sitemapXml } from './seo';
import { SITE } from './site';

describe('pageMeta (a page’s title, description and share tags)', () => {
	const meta = pageMeta({
		title: 'The lever',
		description: 'A bar and a pivot.',
		path: '/learn/simple-machines/lever',
		image: '/covers/lever.jpg'
	});

	it('titles the page with the site name after it', () => {
		expect(meta.title).toBe('The lever · vmechs');
	});

	it('gives full addresses, because link previews need them', () => {
		expect(meta.canonical).toBe(`${SITE.url}/learn/simple-machines/lever`);
		expect(meta.og['og:url']).toBe(meta.canonical);
		expect(meta.og['og:image']).toBe(`${SITE.url}/covers/lever.jpg`);
	});

	it('fills the share tags from the same title and description', () => {
		expect(meta.og['og:title']).toBe('The lever');
		expect(meta.og['og:description']).toBe('A bar and a pivot.');
		expect(meta.og['og:site_name']).toBe('vmechs');
		expect(meta.twitter['twitter:card']).toBe('summary_large_image');
	});

	it('uses the plain site title for the homepage', () => {
		expect(pageMeta({ title: '', description: 'd', path: '/', image: '/x.jpg' }).title).toBe(
			'vmechs · How machines actually work'
		);
	});
});

describe('sitemapXml', () => {
	const xml = sitemapXml([
		{ path: '/' },
		{ path: '/learn/engine/four-stroke-cycle', lastmod: '2026-11-16' }
	]);

	it('lists each page by its full address', () => {
		expect(xml).toContain(`<loc>${SITE.url}/</loc>`);
		expect(xml).toContain(`<loc>${SITE.url}/learn/engine/four-stroke-cycle</loc>`);
	});

	it('gives a last-modified date where one is known, and none otherwise', () => {
		expect(xml).toContain('<lastmod>2026-11-16</lastmod>');
		expect(xml.match(/<lastmod>/g)).toHaveLength(1);
	});

	it('is a sitemap document', () => {
		expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml.match(/<url>/g)).toHaveLength(2);
	});

	it('escapes characters that would break the XML', () => {
		expect(sitemapXml([{ path: '/a&b' }])).toContain('/a&amp;b</loc>');
	});
});
