/**
 * The screw, as pure functions (source: OpenStax Physics 9.3: "a lever
 * attached to a circular inclined plane"; the distance between threads is the
 * pitch; for a screw, the input distance is the circumference of the circle
 * the force is applied round and the output distance is the pitch; a screw
 * jack lifts the corner of a car a short distance).
 *
 * Turned once at radius R, your hand goes 2πR round and the screw rises one
 * pitch P, so by the general rule (the effort's distance ÷ the load's
 * distance) the ideal advantage is 2πR ÷ P.
 *
 * Lengths are in metres, forces in newtons.
 */
import { push } from '../lever/lever.ts';

/** The ideal mechanical advantage: 2π × the radius you turn it at ÷ the pitch. */
export function advantage(radius: number, pitch: number): number {
	return (2 * Math.PI * radius) / pitch;
}

/** The steady push, round the circle, that lifts a load. */
export function effortFor(load: number, radius: number, pitch: number): number {
	return load / advantage(radius, pitch);
}

/** How far the screw rises in `turns` turns: one pitch per turn. */
export function rise(turns: number, pitch: number): number {
	return turns * pitch;
}

/** How far your hand goes round in `turns` turns at `radius`. */
export function handTravel(turns: number, radius: number): number {
	return turns * 2 * Math.PI * radius;
}

/** The screw jack in each step of the lesson. */
export interface StepSetup {
	/** The radius you turn it at: the screw's head, or the handle's length. */
	radius: number;
	/** The distance between threads. */
	pitch: number;
	/** The load's weight, in newtons. */
	load: number;
	/** Whether a handle (a lever) turns it. */
	handle: boolean;
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. The bare screw, turned by its 5 cm head.
	{ radius: 0.05, pitch: 0.02, load: 3000, handle: false },
	// 2. One turn lifts it one pitch: 2 cm.
	{ radius: 0.05, pitch: 0.02, load: 3000, handle: false },
	// 3. A 30 cm handle: about 32 N lifts 3,000 N.
	{ radius: 0.3, pitch: 0.02, load: 3000, handle: true },
	// 4. The trade: nearly 2 m round for every 2 cm up.
	{ radius: 0.3, pitch: 0.02, load: 3000, handle: true },
	// 5. A finer thread, 1 cm: about 16 N, but twice the turns for the same lift.
	{ radius: 0.3, pitch: 0.01, load: 3000, handle: true }
];

/** How many turns at full push. */
export const MAX_TURNS = 2;

/** Degrees of the lesson's one value per step: one push. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, that step's
 * jack, how many turns, the push and the load, the advantage, how far your
 * hand has gone round and how far the load has risen.
 */
export function screwAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const turns = MAX_TURNS * push(angle - step * STEP_SPAN);
	return {
		step,
		...setup,
		turns,
		effort: effortFor(setup.load, setup.radius, setup.pitch),
		advantage: advantage(setup.radius, setup.pitch),
		effortMoved: handTravel(turns, setup.radius),
		loadMoved: rise(turns, setup.pitch)
	};
}
