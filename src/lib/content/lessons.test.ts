import { describe, it, expect } from 'vitest';
import { pathToRef } from './articles';
import { validateLessonMeta, type LessonMeta } from './lesson-meta';
import { buildSystemIndex, SYSTEMS } from './systems';

// Every lesson's frontmatter, read the same way the site reads it.
const lessons = import.meta.glob<LessonMeta>('/src/content/articles/**/*.md', {
	eager: true,
	import: 'metadata'
});
const today = new Date().toISOString().slice(0, 10);

describe('every lesson meets the content standard (docs/CONTENT.md)', () => {
	it('finds the lessons', () => {
		expect(Object.keys(lessons).length).toBeGreaterThan(0);
	});

	for (const [path, meta] of Object.entries(lessons)) {
		it(path.replace('/src/content/articles/', ''), () => {
			expect(validateLessonMeta(meta, today)).toEqual([]);
		});
	}

	it('the homepage links every lesson exactly once, and nothing that is not written', () => {
		const listings = Object.entries(lessons).map(([path, meta]) => ({
			...meta,
			...pathToRef(path)
		}));
		const entries = buildSystemIndex(SYSTEMS, listings).flatMap((s) => s.lessons);
		const links = entries.flatMap((l) => (l.href ? [l.href] : []));

		const expected = listings.map((l) => `/learn/${l.category}/${l.slug}`);
		expect([...links].sort()).toEqual([...expected].sort());

		// planned-but-unwritten entries are shown dimmed, never as links
		for (const entry of entries) expect(entry.available).toBe(entry.href !== null);
	});
});
