/**
 * A lesson step as authored in an article's frontmatter. The short `subtitle`
 * is what the stage shows; the long explanation lives in the article body
 * inside <Step n={…}>.
 */
export interface StepMeta {
	title: string;
	/** Driving-angle range [from, to). Half-open, so boundaries belong to the next step. */
	from: number;
	to: number;
	/** One or two sentences for the stage. `*word*` marks the highlighted word. */
	subtitle: string;
}

export interface Segment {
	text: string;
	hl: boolean;
}

/** Split a subtitle into plain and highlighted runs. Only `*…*` pairs count. */
export function parseEmphasis(s: string): Segment[] {
	const out: Segment[] = [];
	const re = /\*([^*]+)\*/g;
	let last = 0;
	for (const m of s.matchAll(re)) {
		if (m.index > last) out.push({ text: s.slice(last, m.index), hl: false });
		out.push({ text: m[1], hl: true });
		last = m.index + m[0].length;
	}
	if (last < s.length) out.push({ text: s.slice(last), hl: false });
	return out;
}

/**
 * The part colour for a highlighted word, if the word names one of the
 * lesson's parts (ADR 0015): the text shows a part in the part's own colour.
 * Matching ignores capitals. Any other highlighted word gets null (the accent).
 */
export function highlightColour<C extends string>(
	word: string,
	parts: Readonly<Record<string, C>> | undefined
): C | null {
	if (!parts) return null;
	const key = Object.keys(parts).find((k) => k.toLowerCase() === word.trim().toLowerCase());
	return key ? parts[key] : null;
}

/** Index of the step whose [from, to) contains `angle`, or -1. */
export function activeStepIndex(steps: StepMeta[], angle: number): number {
	return steps.findIndex((s) => angle >= s.from && angle < s.to);
}

/** How far through a step the playhead is, clamped to 0..1. */
export function stepProgress(step: StepMeta, angle: number): number {
	return Math.min(1, Math.max(0, (angle - step.from) / (step.to - step.from)));
}
