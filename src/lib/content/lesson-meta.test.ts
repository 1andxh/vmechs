import { describe, it, expect } from 'vitest';
import { validateLessonMeta, type LessonMeta } from './lesson-meta';

const TODAY = '2026-11-14';

function valid(): LessonMeta {
	return {
		title: 'How a four-stroke engine works',
		category: 'engine',
		summary: 'Intake, compression, power, exhaust.',
		difficulty: 'Beginner',
		order: 1,
		reviewed: '2026-11-14',
		sources: [{ title: 'Internal Combustion Engine Fundamentals', author: 'J. B. Heywood' }],
		simplifications: ['Valve timing is idealised.'],
		steps: [
			{
				title: 'Intake',
				from: 0,
				to: 180,
				subtitle: 'The piston drops and the *intake valve* opens.'
			},
			{ title: 'Compression', from: 180, to: 360, subtitle: 'Both valves close.' }
		]
	};
}

const errorsFor = (patch: Partial<LessonMeta>) =>
	validateLessonMeta({ ...valid(), ...patch }, TODAY);

describe('validateLessonMeta (the content standard, enforced)', () => {
	it('accepts a lesson that meets the standard', () => {
		expect(validateLessonMeta(valid(), TODAY)).toEqual([]);
	});

	it('requires at least one source', () => {
		expect(errorsFor({ sources: [] })).toContain('needs at least one source');
	});

	it('requires a real ISO review date', () => {
		expect(errorsFor({ reviewed: '14/11/2026' })).toContain(
			'reviewed must be a date like 2026-11-14'
		);
		expect(errorsFor({ reviewed: '2026-02-30' })).toContain(
			'reviewed must be a date like 2026-11-14'
		);
	});

	it('rejects a review date in the future', () => {
		expect(errorsFor({ reviewed: '2027-01-01' })).toContain('reviewed date is in the future');
	});

	it('requires source links to use https', () => {
		expect(errorsFor({ sources: [{ title: 'A page', url: 'http://example.com' }] })).toContain(
			'source "A page" must link over https'
		);
	});

	it('requires steps to start at 0 and follow on without gaps or overlaps', () => {
		const gap = valid();
		gap.steps[1] = { ...gap.steps[1], from: 200 };
		expect(validateLessonMeta(gap, TODAY)).toContain('step 2 must start where step 1 ends (180)');
		const late = valid();
		late.steps[0] = { ...late.steps[0], from: 10 };
		expect(validateLessonMeta(late, TODAY)).toContain('step 1 must start at 0');
	});

	it('keeps subtitles to at most two sentences', () => {
		const long = valid();
		long.steps[0] = { ...long.steps[0], subtitle: 'One. Two. Three.' };
		expect(validateLessonMeta(long, TODAY)).toContain(
			'step 1 subtitle has more than two sentences'
		);
	});

	it('allows at most one highlighted word per subtitle', () => {
		const two = valid();
		two.steps[0] = { ...two.steps[0], subtitle: 'The *piston* and the *valve* move.' };
		expect(validateLessonMeta(two, TODAY)).toContain(
			'step 1 subtitle highlights more than one word'
		);
	});
});
