/**
 * The homepage's exploded drawing: scrolling takes the V8 apart one group of
 * parts at a time, each with one sentence about it.
 *
 * One value drives it all, as in the lessons: scroll progress p, 0..1, one
 * stage per screen (tourProgress). Stage i's sentence is centred on screen at
 * p = i / (STAGES.length - 1), and its part group travels out while you
 * scroll from the stage before it.
 */

import type { V3 } from './frame.ts';

export type Group = 'intake' | 'turbos' | 'front' | 'heads';

/** Shared between the page (which writes it) and the 3D scene (which reads it). */
export interface TourState {
	/** Scroll progress through the tour, 0..1. */
	progress: number;
	/** Reduced motion: keep the engine assembled. */
	still: boolean;
	/** Run the engine: on screen, and motion allowed. */
	running: boolean;
}

export interface Stage {
	/** The part group this stage takes out and highlights, if any. */
	group: Group | null;
	/** One sentence; the `*word*` names the highlighted part. */
	text: string;
}

export const STAGES: Stage[] = [
	{ group: null, text: '' }, // the assembled engine, under the headline
	{
		group: 'intake',
		text: 'Air is drawn in through the *intake*, then down a runner to each cylinder.'
	},
	{
		group: 'turbos',
		text: 'Exhaust spins each *turbocharger*, and its other wheel pushes extra air in.'
	},
	{
		group: 'front',
		text: 'One *belt* off the crankshaft turns the water pump, alternator and air conditioning.'
	},
	{
		group: 'heads',
		text: 'Under the *cylinder heads*, eight pistons rise and fall in turn, spinning one crankshaft.'
	},
	{
		group: null,
		text: 'Back together, it fires dozens of times a second, even at idle. Now watch one cylinder run.'
	}
];

const SEG = 1 / (STAGES.length - 1);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Starts and ends gently, like a part lifted by hand. */
const ease = (x: number) => x * x * (3 - 2 * x);

/**
 * Progress through the tour from the tour's top edge (`top`, as from
 * getBoundingClientRect) and the viewport height: one stage per screen
 * scrolled, 0 at the headline and 1 at the last stage.
 */
export function tourProgress(top: number, viewport: number): number {
	return clamp01(-top / viewport / (STAGES.length - 1));
}

/**
 * How far out each group is, 0 (in place) to 1 (fully out), at progress p.
 * Each group comes out on the way to its own stage; in the last stage they
 * all go back together, so the tour ends with the whole engine running.
 */
export function explodeAt(p: number): Record<Group, number> {
	const out = { intake: 0, turbos: 0, front: 0, heads: 0 };
	const last = STAGES.length - 1;
	const together = ease(clamp01((p - (last - 1) * SEG) / SEG));
	STAGES.forEach((stage, i) => {
		if (stage.group) out[stage.group] = ease(clamp01((p - (i - 1) * SEG) / SEG)) * (1 - together);
	});
	return out;
}

/** The stage whose sentence is nearest the scroll position. */
export function stageAt(p: number): number {
	return Math.round(clamp01(p) / SEG);
}

/**
 * One frame of gliding toward `target`: covers the same share of the gap in
 * the same time at any frame rate (exponential ease, time constant `tau`
 * seconds), so wheel steps of ~100px become smooth motion. Snaps to the
 * target once it's within a ten-thousandth.
 */
export function follow(current: number, target: number, dt: number, tau = 0.12): number {
	const next = current + (target - current) * (1 - Math.exp(-dt / tau));
	return Math.abs(target - next) < 1e-4 ? target : next;
}

/** Where the camera stands and what it looks at. */
export interface View {
	eye: V3;
	look: V3;
}

/**
 * One view per stage, framing what that stage is about (wide screens; the
 * scene stands further back on narrow ones). In scene units, engine frame.
 */
export const VIEWS: View[] = [
	{ eye: [-21, 15, -25], look: [0, 2.4, 0.5] }, // the whole engine, beside the headline
	{ eye: [-35, 30, -41], look: [0, 6, 0] }, // the intake, lifted off the top
	{ eye: [-41.5, 16, -31.4], look: [-1, 2.5, 1] }, // the turbos, pulled out to the sides
	{ eye: [-23, 15, -42.5], look: [0, 3, -6] }, // the belt drive, slid off the front
	{ eye: [-30, 36.5, -28.5], look: [-1, 4.5, -1] }, // down into the bores, heads lifted
	{ eye: [-27.3, 18.8, -32.7], look: [0, 2.4, 0.5] } // back together, running
];

/** The camera at tour position t (in stages: 0 = headline, 1 per stage), eased between views. */
export function cameraAt(t: number): View {
	const last = VIEWS.length - 1;
	const at = Math.min(last, Math.max(0, t));
	const i = Math.min(last - 1, Math.floor(at));
	const f = ease(at - i);
	const mix = (a: V3, b: V3): V3 => [
		a[0] + (b[0] - a[0]) * f,
		a[1] + (b[1] - a[1]) * f,
		a[2] + (b[2] - a[2]) * f
	];
	return { eye: mix(VIEWS[i].eye, VIEWS[i + 1].eye), look: mix(VIEWS[i].look, VIEWS[i + 1].look) };
}
