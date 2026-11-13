/**
 * Single-cylinder 4-stroke kinematics as pure functions.
 *
 * Angle convention: `cycleDeg` is the position in the full 4-stroke cycle,
 * 0–720° (two crank revolutions). 0° = top dead centre (TDC) at the start of
 * the intake stroke. The crank itself only cares about cycleDeg mod 360.
 */

export interface EngineGeometry {
	/** Crank throw: distance from crankshaft centre to crank pin. Stroke = 2 × this. */
	crankRadius: number;
	/** Connecting rod length, centre of crank pin to centre of wrist (piston) pin. */
	rodLength: number;
}

/** The engine every view of this lesson draws. Units are arbitrary (scene units). */
export const ENGINE: EngineGeometry = { crankRadius: 1, rodLength: 3.5 };

export type Stroke = 'intake' | 'compression' | 'power' | 'exhaust';
export type Valve = 'intake' | 'exhaust';

const STROKES: readonly Stroke[] = ['intake', 'compression', 'power', 'exhaust'];
const DEG = Math.PI / 180;

/** Wrap any angle into [0, 720). JS `%` keeps the sign, so fix negatives. */
export function wrapCycle(cycleDeg: number): number {
	return ((cycleDeg % 720) + 720) % 720;
}

function assertGeometry({ crankRadius, rodLength }: EngineGeometry): void {
	if (!(rodLength > crankRadius) || !(crankRadius > 0)) {
		throw new RangeError(
			`rodLength (${rodLength}) must be greater than crankRadius (${crankRadius}) > 0, ` +
				'otherwise the rod cannot reach the piston at 90°.'
		);
	}
}

/**
 * Height of the wrist pin above the crankshaft centre.
 *
 * The crank pin sits at (r·sinθ, r·cosθ). The rod (length l) connects it to
 * the wrist pin, which can only move vertically (x = 0). Pythagoras on the
 * rod gives the vertical span l_y = √(l² − r²·sin²θ), so:
 *
 *     h(θ) = r·cosθ + √(l² − r²·sin²θ)
 */
export function wristPinHeight(cycleDeg: number, g: EngineGeometry): number {
	assertGeometry(g);
	const { crankRadius: r, rodLength: l } = g;
	const t = cycleDeg * DEG;
	const s = Math.sin(t);
	return r * Math.cos(t) + Math.sqrt(l * l - r * r * s * s);
}

/** Crank pin position relative to the crankshaft centre (x right, y up). */
export function crankPin(cycleDeg: number, g: EngineGeometry): { x: number; y: number } {
	const t = cycleDeg * DEG;
	return { x: g.crankRadius * Math.sin(t), y: g.crankRadius * Math.cos(t) };
}

/** Distance the piston has travelled down from TDC. 0 at TDC, 2r at BDC. */
export function pistonDisplacement(cycleDeg: number, g: EngineGeometry): number {
	return g.crankRadius + g.rodLength - wristPinHeight(cycleDeg, g);
}

/** Which of the four strokes is happening at this point in the cycle. */
export function strokeAt(cycleDeg: number): Stroke {
	return STROKES[Math.floor(wrapCycle(cycleDeg) / 180)];
}

/**
 * Valve lift, 0 (closed) to 1 (fully open).
 *
 * Idealized timing: each valve opens exactly at the start of its stroke and
 * closes exactly at the end, following a half-sine (a smooth cam profile).
 * Real engines open/close early/late (valve overlap); that's a later lesson.
 */
export function valveLift(cycleDeg: number, valve: Valve): number {
	const open = valve === 'intake' ? 0 : 540;
	const local = wrapCycle(cycleDeg) - open;
	if (local <= 0 || local >= 180) return 0;
	return Math.sin(local * DEG);
}
