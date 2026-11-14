import { describe, it, expect } from 'vitest';
import { validateLessonMeta, type LessonMeta } from './lesson-meta';

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
});
