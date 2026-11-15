/**
 * The V8's pipe routes, shared by the pipes themselves (V8Turbo, V8Intake)
 * and by the gas flowing through them, so the flow always runs down the
 * middle of its pipe. Every route is listed in the direction the gas moves.
 *
 * Air: in front of each turbo's compressor → its wheel; compressor outlet →
 * charge pipe → throttle body → plenum → a runner to each intake port.
 * Exhaust: each exhaust port → its primary pipe → the bank's collector (on
 * the turbine); turbine → the downpipe. Flow is drawn in pipes only, never
 * through the turbo housings.
 */
import { DECK, at, cylZ, turboAt, type Bank, type V3 } from './frame.ts';

const DEG = Math.PI / 180;

/** Where both banks' charge pipes meet the throttle body. */
export const THROTTLE_INLET: V3 = [0, 5.6, -7.6];

/** The charge pipe: from the compressor outlet, up and forward to the throttle body. */
export function chargePipe(b: Bank): V3[] {
	const [tx, ty, tz] = turboAt(b);
	return [
		[tx, ty + 1.6, tz - 1.7],
		[tx * 1.05, ty + 3.2, tz - 4.5],
		[b.sgn * 3.2, 5.4, -7.6],
		[b.sgn * 0.9, 5.8, -8.4],
		THROTTLE_INLET
	];
}

/**
 * Air drawn into one bank's compressor from in front, up to its wheel. (The
 * flow is drawn in pipes only, never through a housing: it picks up again at
 * the compressor outlet, along the charge pipe.)
 */
export function airIn(b: Bank): V3[] {
	const [tx, ty, tz] = turboAt(b);
	return [
		[tx, ty, tz - 4.6],
		[tx, ty, tz - 3.0]
	];
}

/** From the throttle body back along the plenum. */
export function airToPlenum(): V3[] {
	return [THROTTLE_INLET, [0, 5.6, -6.4], [0, 5.7, -4.8], [0, 5.7, 4.8]];
}

/** The runner from the plenum to cylinder i's intake port. */
export function runner(b: Bank, i: number): V3[] {
	const z = cylZ(b, i);
	return [[b.sgn * 1.05, 5.4, z], [b.sgn * 1.9, 5.6, z], at(b, DECK + 0.5, -1.5, z)];
}

/** Where a bank's four primaries join, above its turbo. */
export function collector(b: Bank): V3 {
	const [tx, ty, tz] = turboAt(b);
	return [tx, ty + 1.6, tz - 0.2];
}

/** The primary pipe from cylinder i's exhaust port to the collector. */
export function primary(b: Bank, i: number): V3[] {
	const [tx, ty, tz] = turboAt(b);
	const z = cylZ(b, i);
	return [
		at(b, DECK + 0.4, 1.6, z),
		at(b, DECK - 0.2, 2.6, z),
		[tx, ty + 2.2, (z + tz) / 2],
		collector(b)
	];
}

/** The downpipe, from under the turbine back toward the exhaust system. */
export function downPipe(b: Bank): V3[] {
	const [tx, ty, tz] = turboAt(b);
	return [
		[tx, ty - 1, tz + 0.5],
		[tx, ty - 2.2, tz + 2.2],
		[tx * 0.8, -3.4, 8.2]
	];
}

/**
 * How far the gas has moved along every route, in scene units, when the
 * crank has turned `crank` degrees. One speed for all routes, so the flow
 * reads as continuous from pipe to pipe; faster engine, faster flow.
 */
const FLOW_PER_RADIAN = 0.6;
export function flowShift(crank: number): number {
	return crank * DEG * FLOW_PER_RADIAN;
}
