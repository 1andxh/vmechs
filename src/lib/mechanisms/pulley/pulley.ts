/**
 * The pulley, as pure functions (sources: OpenStax College Physics 2e 9.5:
 * "an ordinary pulley has an MA of 1; it only changes the direction of the
 * force", and the number of cables pulling up on the load is about the MA;
 * OpenStax Physics 9.3: count the ropes supporting the load for the IMA, and
 * to raise a load 1 metre you pull N metres of rope).
 *
 * The lesson draws the pulleys in a row, as textbooks do, so every rope runs
 * straight up and down and can be counted. Ropes are numbered left to right:
 * 0 to n − 1 hold the load up, and rope n is the one you pull. Each pair of
 * neighbouring ropes is joined by a pulley, either a fixed one at the top or
 * a moving one at the bottom, with the load.
 *
 * Lengths are in metres, forces in newtons.
 */
import { push } from '../lever/lever.ts';

/** The effort that holds a load up with `ropes` ropes holding it, each pulled as hard as you pull. */
export function effortFor(load: number, ropes: number): number {
	return load / ropes;
}

/** How much rope you pull to lift the load by `lift`: every rope holding it shortens by `lift`. */
export function ropePulled(ropes: number, lift: number): number {
	return ropes * lift;
}

/**
 * How the rope is threaded for `ropes` ropes holding the load. `joins[k]` is
 * the pulley joining rope k to rope k + 1: 'top' for a fixed pulley, 'bottom'
 * for a moving one. They alternate, and the last is always a fixed pulley, off
 * which your rope comes down. `anchor` is where rope 0 is tied: the beam for
 * an even number of ropes, the moving pulleys for an odd one.
 */
export function routing(ropes: number): {
	joins: ('top' | 'bottom')[];
	anchor: 'top' | 'bottom';
} {
	const joins = Array.from({ length: ropes }, (_, k) =>
		(k + ropes) % 2 === 0 ? ('bottom' as const) : ('top' as const)
	);
	return { joins, anchor: ropes % 2 === 0 ? 'top' : 'bottom' };
}

/**
 * How much rope has run through the pulley joining rope k to rope k + 1 when
 * the load has risen by `lift`: ropes 0 to k have each shortened by `lift`, so
 * (k + 1) × lift has passed it. Divided by the pulley's radius, it's how far
 * that pulley has turned.
 */
export function ropeThrough(k: number, lift: number): number {
	return (k + 1) * lift;
}

/** The pulleys in each step of the lesson. */
export interface StepSetup {
	/** The number of ropes holding the load up. */
	ropes: number;
	/** The load's weight, in newtons. */
	load: number;
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. One fixed pulley: it turns your pull around, but 300 N still lifts only 300 N.
	{ ropes: 1, load: 300 },
	// 2. A moving pulley on the load: two ropes hold it, so 150 N lifts 300 N.
	{ ropes: 2, load: 300 },
	// 3. The trade: two metres of rope for every metre the load rises.
	{ ropes: 2, load: 300 },
	// 4. Two fixed and two moving pulleys: four ropes, 75 N lifts 300 N.
	{ ropes: 4, load: 300 },
	// 5. The rope tied to the moving pulleys: three ropes, an advantage of 3.
	{ ropes: 3, load: 300 }
];

/** How far the load rises at full pull, in metres. */
export const MAX_LIFT = 0.25;

/** Degrees of the lesson's one value per step: one pull. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, how the rope
 * is threaded, how far the load has risen, the forces, the advantage (the
 * number of ropes holding the load), and how much rope you've pulled.
 */
export function pulleyAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const lift = MAX_LIFT * push(angle - step * STEP_SPAN);
	return {
		step,
		...setup,
		...routing(setup.ropes),
		lift,
		effort: effortFor(setup.load, setup.ropes),
		advantage: setup.ropes,
		effortMoved: ropePulled(setup.ropes, lift),
		loadMoved: lift
	};
}
