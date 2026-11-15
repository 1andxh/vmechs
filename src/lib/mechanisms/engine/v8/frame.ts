/**
 * The V8's coordinate frame and main dimensions, shared by its parts.
 *
 * Crankshaft along z (front of the engine at −z), y up. Two banks of four
 * cylinders at ±45° from vertical; the right bank is staggered back by about
 * a rod's width, as on a real V8. Units match the lesson engine (crank radius 1).
 */

export type V3 = [number, number, number];

export const DECK = 5.3; // top of the cylinder bores along each bank's axis
export const PITCH = 3; // distance between cylinders along the crank
export const STAGGER = 0.6;
export const FRONT_Z = -7.3; // plane of the front pulleys
export const ALONG_Z: V3 = [Math.PI / 2, 0, 0]; // turns a y-aligned cylinder to lie along z
export const FOUR = [0, 1, 2, 3];

const S45 = Math.SQRT1_2;

export interface Bank {
	name: 'left' | 'right';
	/** Tilt from vertical in degrees (clockwise positive, seen from the front). */
	deg: number;
	/** −1 for the left bank, +1 for the right. */
	sgn: -1 | 1;
	/** Stagger along the crank. */
	dz: number;
}

export const BANKS: Bank[] = [
	{ name: 'left', deg: -45, sgn: -1, dz: -STAGGER / 2 },
	{ name: 'right', deg: 45, sgn: 1, dz: STAGGER / 2 }
];

/** A point `d` up a bank's axis and `s` outward (away from the V), at depth z. */
export const at = (b: Bank, d: number, s: number, z: number): V3 => [
	b.sgn * S45 * (d + s),
	S45 * (d - s),
	z
];

/** Rotation that lines a part up with its bank. */
export const tilt = (b: Bank): V3 => [0, 0, -b.deg * (Math.PI / 180)];

/** Where cylinder i (0 = front) of a bank sits along the crank. */
export const cylZ = (b: Bank, i: number) => (i - 1.5) * PITCH + b.dz;

/** Each bank's turbo: low on the outside, towards the back. */
export const turboAt = (b: Bank): V3 => at(b, 2.6, 4.6, 3);
