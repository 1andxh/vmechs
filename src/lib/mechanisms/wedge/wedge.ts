/**
 * The wedge, as pure functions (source: OpenStax Physics 9.3: "two inclined
 * planes back to back", IMA = length ÷ thickness, knives and axe heads as
 * examples; with a wedge the load stays put and the machine moves).
 *
 * A symmetric wedge of length L (tip to back) and thickness t (at the back)
 * is pushed point first into a log split into two halves. Driven in by d, it
 * is d × t ÷ L thick where it meets the top of the log, so that is how far the
 * halves have been pushed apart. By the general rule (the effort's distance ÷
 * the load's distance) the ideal advantage is L ÷ t, and the force pressing
 * each half aside is the push × L ÷ t.
 *
 * Lengths are in metres, forces in newtons.
 */
import { push } from '../lever/lever.ts';

/** The ideal mechanical advantage: length ÷ thickness. */
export function advantage(length: number, thickness: number): number {
	return length / thickness;
}

/** The force pressing each side apart, for a steady push on the wedge's back. */
export function splitForce(effort: number, length: number, thickness: number): number {
	return (effort * length) / thickness;
}

/** How far apart the two sides have been pushed, with the wedge driven in by `driven`. */
export function opening(driven: number, length: number, thickness: number): number {
	return (driven * thickness) / length;
}

/** The wedge in each step of the lesson. */
export interface StepSetup {
	/** From tip to back. */
	length: number;
	/** Across the back. */
	thickness: number;
	/** Your push on its back, in newtons. */
	effort: number;
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. Two ramps back to back, driven into a log.
	{ length: 0.6, thickness: 0.1, effort: 100 },
	// 2. Six times as long as it's thick: 100 N presses each side apart with 600 N.
	{ length: 0.6, thickness: 0.1, effort: 100 },
	// 3. The trade: in six centimetres, open one.
	{ length: 0.6, thickness: 0.1, effort: 100 },
	// 4. Twice as thick: half the force, twice the opening.
	{ length: 0.6, thickness: 0.2, effort: 100 },
	// 5. A blade, ten times as long as it's thick: 1,000 N.
	{ length: 0.6, thickness: 0.06, effort: 100 }
];

/** How far the wedge goes in at full push, as a share of its length. */
export const MAX_DRIVE = 0.6;

/** Degrees of the lesson's one value per step: one push. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, that step's
 * wedge, the push and the force pressing each side apart (the load), the
 * advantage, how far the wedge has gone in and how far the wood has opened.
 */
export function wedgeAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const driven = MAX_DRIVE * setup.length * push(angle - step * STEP_SPAN);
	return {
		step,
		...setup,
		load: splitForce(setup.effort, setup.length, setup.thickness),
		advantage: advantage(setup.length, setup.thickness),
		effortMoved: driven,
		loadMoved: opening(driven, setup.length, setup.thickness)
	};
}
