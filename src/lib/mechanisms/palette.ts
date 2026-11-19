/**
 * The machine palette (ADR 0015): one colour per part, in two shades. The
 * fill is for the 3D part, the text shade for a word that names it. The same
 * values are tokens in src/app.css, for the page; a test keeps them equal.
 *
 * InkRenderer's colour mode outlines each part in a darker shade of its own
 * colour: the lit colour times OUTLINE, in linear light. outlineOf works that
 * out for a part's fill, so its contrast against the paper can be tested.
 */

export const PAPER = '#f5f1ea';
/** Structure that isn't the point of the lesson: blocks, heads, housings. */
export const STRUCTURE = '#c4bdb2';

export const PARTS = {
	red: { fill: '#e5484d', text: '#c42d33' },
	green: { fill: '#3fa35a', text: '#2a7a40' },
	blue: { fill: '#3d7ad6', text: '#2c62b4' },
	gold: { fill: '#e2b33c', text: '#8f6400' },
	// a cool grey that still stands out against the warm grey structure (smoke, exhaust)
	slate: { fill: '#748190', text: '#525d69' }
} as const;

export type PartColour = keyof typeof PARTS;

/** How much darker an outline is than its part, in linear light. */
export const OUTLINE = 0.3;

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** The outline InkRenderer draws around a part of this colour (lit at full strength). */
export function outlineOf(fill: string): string {
	return (
		'#' +
		channels(fill)
			.map((c) => Math.round(toSrgb(toLinear(c) * OUTLINE) * 255))
			.map((v) => v.toString(16).padStart(2, '0'))
			.join('')
	);
}

/** WCAG contrast ratio between two colours. */
export function contrast(a: string, b: string): number {
	const lum = (hex: string) => {
		const [r, g, bl] = channels(hex).map(toLinear);
		return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
	};
	const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}
