/**
 * How the homepage V8 runs: which piston is where, and how fast everything
 * on the belt turns, from one value, the crank angle. Pure functions, built
 * on the lesson's single-cylinder kinematics.
 *
 * The crank angle is UNWRAPPED (it keeps growing). One engine cycle is 720°
 * (two turns), but the pulleys turn at ratios like 2.45 : 1, and wrapping
 * the crank every 720° would make them jump by a fraction of a turn.
 *
 * Layout and conventions (GM numbering, as on a classic small-block V8):
 *   - odd cylinders 1, 3, 5, 7 on the left bank, front to back; even on the right;
 *   - firing order 1-8-4-3-6-5-7-2, one cylinder every 90° of crank;
 *   - the crank turns clockwise seen from the front;
 *   - cylinders 1 & 2 share the first crank throw, 3 & 4 the second, and so on.
 * With those, the throws come out at 315°, 225°, 45° and 135°: two pairs in
 * planes at right angles, which is what makes it a cross-plane crank.
 */
import { ENGINE, pistonDisplacement, wrapCycle } from '../kinematics.ts';
import { PULLEYS, type Pulley } from './drive.ts';
import { BANKS } from './frame.ts';

export const FIRING_ORDER = [1, 8, 4, 3, 6, 5, 7, 2];

export interface Cylinder {
	/** Cylinder number, 1–8. */
	n: number;
	bank: 'left' | 'right';
	/** Position along the bank, 0 = front. Also the crank throw it shares. */
	index: number;
}

export const CYLINDERS: Cylinder[] = [0, 1, 2, 3].flatMap((index) => [
	{ n: 2 * index + 1, bank: 'left' as const, index },
	{ n: 2 * index + 2, bank: 'right' as const, index }
]);

/** The left bank's bore tilt from vertical, degrees (toward +x positive). */
const LEFT_BORE = BANKS.find((b) => b.name === 'left')!.deg;
const CRANK_PULLEY = PULLEYS.find((p) => p.name === 'crank')!;

/** Crank angle at which cylinder n fires (starts its power stroke), 0–630. */
const firesAt = (n: number) => 90 * FIRING_ORDER.indexOf(n);

/** Crank angle after `seconds` at `rpm`: one turn is 360°, so rpm × 6 degrees a second. */
export function crankAt(seconds: number, rpm: number): number {
	return seconds * rpm * 6;
}

/**
 * Where cylinder n is in its own four-stroke cycle (0–720, the lesson's
 * convention: 0 = top of the intake stroke, 360 = top as it fires).
 */
export function cylinderCycle(n: number, crank: number): number {
	return wrapCycle(crank - firesAt(n) + 360);
}

/** How far piston n is below the top of its stroke: 0 at TDC, 2 × crank radius at BDC. */
export function pistonTravel(n: number, crank: number): number {
	return pistonDisplacement(cylinderCycle(n, crank), ENGINE);
}

/**
 * Direction of crank throw j (0 = front) at this crank angle, in degrees from
 * vertical toward +x. A throw points up a bore exactly when that bore's
 * piston is at TDC, so the left-bank cylinder on the throw fixes its phase.
 */
export function throwAngle(j: number, crank: number): number {
	return LEFT_BORE + firesAt(2 * j + 1) - crank;
}

/**
 * How far a belt-driven pulley has turned, in degrees, when the crank has
 * turned `crank` degrees. The belt moves every pulley's rim at the same
 * speed, so a pulley turns faster the smaller it is.
 */
export function pulleyTurn(p: Pulley, crank: number): number {
	return (crank * CRANK_PULLEY.r) / p.r;
}

/**
 * How far the turbo wheels have turned, in degrees. A turbo isn't geared to
 * the crank; exhaust gas spins it, at up to about 100,000 rpm. That can't be
 * drawn, so this is a display ratio: fast enough to read as spinning.
 */
const TURBO_DISPLAY_RATIO = 6;
export function turboTurn(crank: number): number {
	return crank * TURBO_DISPLAY_RATIO;
}
