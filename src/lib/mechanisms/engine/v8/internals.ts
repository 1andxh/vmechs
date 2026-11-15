/**
 * Where the V8's moving parts are drawn, from the crank angle: crank pins,
 * wrist pins, rods and pistons, in the engine's frame (v8/frame.ts). The
 * timing comes from v8/kinematics.ts; this file turns it into positions.
 */
import { ENGINE, wristPinHeight } from '../kinematics.ts';
import { BANKS, at, cylZ, type V3 } from './frame.ts';
import { CYLINDERS, cylinderCycle, throwAngle } from './kinematics.ts';

const DEG = Math.PI / 180;

/** The bores in each bank's block. */
export const BORE = { radius: 1.1 };

/**
 * Piston size, along its bore: `crown` is how far the top sits above the
 * wrist pin, `height` the length from crown to skirt.
 */
export const PISTON = { radius: 1.0, height: 1.25, crown: 0.7 };

/** Where each bank's block slab starts, measured up the bank's axis from the crank. */
export const SLAB_BASE = 1.2;

const cylinder = (n: number) => {
	const c = CYLINDERS.find((x) => x.n === n);
	if (!c) throw new RangeError(`No cylinder ${n}`);
	return { ...c, bank: BANKS.find((b) => b.name === c.bank)! };
};

/** Centre of crank throw j's pin at this crank angle, at depth z along the crank. */
export function crankPin(j: number, crank: number, z: number): V3 {
	const a = throwAngle(j, crank) * DEG;
	return [ENGINE.crankRadius * Math.sin(a), ENGINE.crankRadius * Math.cos(a), z];
}

/**
 * How far to turn the whole crankshaft (radians about z) at this crank angle,
 * when it's modelled at angle 0. Throws move clockwise seen from the front,
 * which is counter-clockwise about +z.
 */
export function crankSpin(crank: number): number {
	return crank * DEG;
}

/** Centre of cylinder n's wrist pin: up its bore axis from the crank centre. */
export function wristPin(n: number, crank: number): V3 {
	const c = cylinder(n);
	const h = wristPinHeight(cylinderCycle(n, crank), ENGINE);
	return at(c.bank, h, 0, cylZ(c.bank, c.index));
}

/**
 * How far to turn cylinder n's rod about z (radians) so that, drawn from its
 * crank pin pointing up (+y), it reaches the wrist pin.
 */
export function rodTurn(n: number, crank: number): number {
	const c = cylinder(n);
	const [px, py] = crankPin(c.index, crank, 0);
	const [wx, wy] = wristPin(n, crank);
	return Math.atan2(-(wx - px), wy - py);
}

/** Height of cylinder n's piston crown up its bore axis, from the crank centre. */
export function pistonCrown(n: number, crank: number): number {
	return wristPinHeight(cylinderCycle(n, crank), ENGINE) + PISTON.crown;
}

/** Length of each bank's block slab along the crank. */
export const SLAB_LENGTH = 12.6;

/**
 * Where the section plane sits (its z) as the heads lift, 0..1: in front of
 * the block while they're on, sweeping back to cut through the front pair of
 * bores (cylinders 1 and 2, which share the first crank throw) once they're off.
 */
const SECTION = { open: -7, cut: -4.5 };
export function sectionZ(lift: number): number {
	return SECTION.open + (SECTION.cut - SECTION.open) * lift;
}
