/**
 * A gear pair over time, for the gears lesson: how long its cycle is, and
 * which teeth are doing the work at a given moment. The driver (z1 teeth)
 * turns anticlockwise by t radians; the driven gear (z2) sits on +x and is
 * placed by `meshAngle`, as in gears.ts.
 */
import { meshAngle } from './gears.ts';

/** The gears lesson's pair: a 12-tooth driver and a 30-tooth driven gear, module 1. */
export const PAIR = { z1: 12, z2: 30, m: 1 } as const;

const TAU = 2 * Math.PI;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * How many degrees the driver turns before both gears are back where they
 * started. That takes the same number of teeth passing on each, and the
 * fewest is the lowest common multiple of z1 and z2: for 12 and 30, 60
 * teeth, which is 5 turns of the driver and 2 of the driven gear.
 */
export function cyclePeriod(z1: number, z2: number): number {
	return (360 * z2) / gcd(z1, z2);
}

/**
 * The teeth in contact at driver angle t: [driver tooth, driven tooth].
 * The driver tooth is the one nearest the line between the centres (the
 * pitch point). It pushes with its leading side, the one facing the way it
 * turns, so the driven tooth is the one just ahead of it: half a tooth
 * pitch round from the gap the driver tooth sits in.
 */
export function contactTeeth(t: number, z1: number, z2: number): [number, number] {
	const n = Math.round((-t * z1) / TAU); // unfolded, so φ stays within half a pitch of 0
	const phi = t + (TAU * n) / z1; // that tooth's angle from the centre line
	// The gears roll without slipping, so the gap it sits in is at π − φ·z1/z2.
	const gapAt = Math.PI - phi * (z1 / z2);
	const pushed = gapAt - Math.PI / z2; // the next tooth round, on the leading side
	const j = mod(Math.round(((pushed - meshAngle(t, z1, z2, 0)) * z2) / TAU), z2);
	return [mod(n, z1), j];
}
