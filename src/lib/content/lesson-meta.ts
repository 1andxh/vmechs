/**
 * A lesson's frontmatter, and the content standard it must meet
 * (see docs/CONTENT.md). The validator runs over every real lesson in the
 * test suite, so a lesson that breaks the standard fails CI.
 */
import type { StepMeta } from './steps.ts';
import { PARTS, type PartColour } from '../mechanisms/palette.ts';

export interface Source {
	title: string;
	author?: string;
	publisher?: string;
	year?: number;
	url?: string;
	/** What this source supports, e.g. "crank–slider geometry". */
	note?: string;
}

export interface LessonMeta {
	title: string;
	category: string;
	summary: string;
	difficulty: string;
	order: number;
	/** When the lesson went live, as YYYY-MM-DD; the homepage features the newest. */
	published: string;
	/** When the lesson was last checked against its sources, as YYYY-MM-DD. */
	reviewed: string;
	sources: Source[];
	/** Where the lesson departs from real engines, stated plainly. */
	simplifications: string[];
	/**
	 * The machine's parts and their colours (ADR 0015), by the name the text
	 * uses: a highlighted word naming a part is shown in that part's colour.
	 */
	parts?: Record<string, PartColour>;
	/** A still of the lesson for listings, served from static/covers/. */
	cover?: string;
	/**
	 * The machine's ideal mechanical advantage as a short formula, such as
	 * "effort arm ÷ load arm", shown beside the lesson on its section page.
	 */
	ima?: string;
	steps: StepMeta[];
}

/** A real calendar date in YYYY-MM-DD form (rejects 2026-02-30). */
function isIsoDate(s: string): boolean {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
	const d = new Date(`${s}T00:00:00Z`);
	return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/**
 * Sentence ends: . ! or ? then a space or the end of the text, allowing
 * closing quotes or brackets in between (`"the bang." Then…` is two).
 */
const countSentences = (s: string) => (s.trim().match(/[.!?]["'”’)\]]*(\s|$)/g) ?? []).length;
/** The text inside each `*highlight*`. */
const highlights = (s: string) => [...s.matchAll(/\*([^*]+)\*/g)].map((m) => m[1].trim());
const MAX_HIGHLIGHT_WORDS = 3;

/** Returns a list of problems; an empty list means the lesson meets the standard. */
export function validateLessonMeta(meta: LessonMeta, today: string): string[] {
	const errors: string[] = [];

	if (!meta.sources?.length) errors.push('needs at least one source');
	for (const src of meta.sources ?? []) {
		if (!src.title?.trim()) errors.push('every source needs a title');
		if (src.url && !src.url.startsWith('https://'))
			errors.push(`source "${src.title}" must link over https`);
	}

	if (!isIsoDate(meta.published ?? '')) {
		errors.push('published must be a date like 2026-11-13');
	} else if (meta.published > today) {
		errors.push('published date is in the future');
	} else if (isIsoDate(meta.reviewed ?? '') && meta.published > meta.reviewed) {
		errors.push('published date is after the review date');
	}

	if (!isIsoDate(meta.reviewed ?? '')) {
		errors.push('reviewed must be a date like 2026-11-14');
	} else if (meta.reviewed > today) {
		errors.push('reviewed date is in the future');
	}

	const colours = Object.keys(PARTS);
	for (const [part, colour] of Object.entries(meta.parts ?? {})) {
		if (!colours.includes(colour))
			errors.push(`part "${part}" has colour "${colour}"; use one of ${colours.join(', ')}`);
	}

	if (meta.cover !== undefined && !/^\/covers\/[\w-]+\.(jpg|png|webp)$/.test(meta.cover)) {
		errors.push('cover must be an image in /covers/, like /covers/four-stroke-cycle.jpg');
	}

	if (meta.ima !== undefined) {
		if (!meta.ima.trim()) errors.push('ima must be a formula, like "effort arm ÷ load arm"');
		else if (meta.ima.length > 40) errors.push('ima must be at most 40 characters');
	}

	if (!Array.isArray(meta.simplifications)) {
		errors.push('simplifications must be a list (it can be empty)');
	}

	const steps = meta.steps ?? [];
	if (!steps.length) errors.push('needs at least one step');
	steps.forEach((step, i) => {
		const n = i + 1;
		if (i === 0 && step.from !== 0) errors.push('step 1 must start at 0');
		if (i > 0 && step.from !== steps[i - 1].to)
			errors.push(`step ${n} must start where step ${i} ends (${steps[i - 1].to})`);
		if (!(step.to > step.from)) errors.push(`step ${n} must end after it starts`);
		if (countSentences(step.subtitle) > 2)
			errors.push(`step ${n} subtitle has more than two sentences`);
		const marked = highlights(step.subtitle);
		if (marked.length > 1) errors.push(`step ${n} subtitle has more than one highlight`);
		for (const text of marked) {
			if (text.split(/\s+/).length > MAX_HIGHLIGHT_WORDS)
				errors.push(`step ${n} highlight "${text}" is longer than three words`);
		}
	});

	return errors;
}
