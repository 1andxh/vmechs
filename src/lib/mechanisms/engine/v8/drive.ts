import { CatmullRomCurve3, Vector3 } from 'three';

/**
 * The front belt drive, in the plane of the pulleys (x across, y up; the
 * plane sits at FRONT_Z). Shared by the drawing and the kinematics, so the
 * pulleys turn at the ratios their drawn sizes imply.
 */

export interface Pulley {
	name: 'crank' | 'water pump' | 'alternator' | 'air conditioning' | 'idler' | 'tensioner';
	at: [number, number];
	r: number;
}

export const PULLEYS: Pulley[] = [
	{ name: 'crank', at: [0, -0.2], r: 1.35 }, // the harmonic damper, on the crankshaft
	{ name: 'water pump', at: [0, 2.8], r: 0.95 },
	{ name: 'alternator', at: [-2.5, 3.7], r: 0.55 },
	{ name: 'air conditioning', at: [2.6, 0.9], r: 0.72 },
	{ name: 'idler', at: [1.6, 2.5], r: 0.42 },
	{ name: 'tensioner', at: [-2.05, 1.5], r: 0.42 } // far enough out for the belt to wrap it (see beltPath)
];

/** The belt is a flat ribbon this thick; its centre line runs half that far out from each rim. */
export const BELT_THICKNESS = 0.1;

/** The order the belt meets the pulleys, going clockwise (seen in this plane). */
const ROUTE: Pulley['name'][] = [
	'crank',
	'tensioner',
	'alternator',
	'water pump',
	'idler',
	'air conditioning'
];

/**
 * The belt's centre line, as dense points: a straight run tangent to each
 * pair of neighbouring pulleys, and an arc around each pulley's rim between
 * them, like a real belt. Every pulley sits on the outside of the loop
 * (checked in the tests), so each run is an outer tangent.
 */
function beltPath(): [number, number][] {
	const off = BELT_THICKNESS / 2;
	const ring = ROUTE.map((name) => {
		const p = PULLEYS.find((q) => q.name === name)!;
		return { x: p.at[0], y: p.at[1], r: p.r + off };
	});
	// Going clockwise, the outside of the loop is on the left of each run.
	const touch = ring.map((a, i) => {
		const b = ring[(i + 1) % ring.length];
		const [dx, dy] = [b.x - a.x, b.y - a.y];
		const len = Math.hypot(dx, dy);
		const [ux, uy] = [dx / len, dy / len];
		const s = (a.r - b.r) / len; // tilt of the run, so it touches both rims
		const c = Math.sqrt(1 - s * s);
		const [nx, ny] = [-uy * c + ux * s, ux * c + uy * s]; // outward, at the tangent points
		return {
			from: [a.x + a.r * nx, a.y + a.r * ny],
			to: [b.x + b.r * nx, b.y + b.r * ny],
			n: [nx, ny]
		};
	});
	const points: [number, number][] = [];
	ring.forEach((p, i) => {
		const into = touch[(i - 1 + ring.length) % ring.length];
		const out = touch[i];
		// arc on this rim, clockwise from where the belt arrives to where it leaves
		let a0 = Math.atan2(into.n[1], into.n[0]);
		const a1 = Math.atan2(out.n[1], out.n[0]);
		if (a0 < a1) a0 += 2 * Math.PI;
		const steps = Math.max(2, Math.ceil((a0 - a1) / (Math.PI / 60)));
		for (let k = 0; k <= steps; k++) {
			const a = a0 - ((a0 - a1) * k) / steps;
			points.push([p.x + p.r * Math.cos(a), p.y + p.r * Math.sin(a)]);
		}
		// then the straight run to the next pulley
		const [fx, fy] = out.from;
		const [tx, ty] = out.to;
		const runSteps = Math.max(2, Math.ceil(Math.hypot(tx - fx, ty - fy) / 0.08));
		for (let k = 1; k < runSteps; k++) {
			points.push([fx + ((tx - fx) * k) / runSteps, fy + ((ty - fy) * k) / runSteps]);
		}
	});
	return points;
}

/** The belt's centre line, as dense points going clockwise. */
export const BELT: [number, number][] = beltPath();

// The belt as a smooth closed curve through its path, measured once.
const belt = new CatmullRomCurve3(
	BELT.map(([x, y]) => new Vector3(x, y, 0)),
	true
);
const LENGTH = belt.getLength();
const CRANK_R = PULLEYS.find((p) => p.name === 'crank')!.r;

/** Length of the belt, in scene units. */
export function beltLength(): number {
	return LENGTH;
}

export interface BeltRib {
	/** Which rib (they keep their index as they travel). */
	index: number;
	/** Where it is along the belt, 0..1. */
	u: number;
	/** Its position in the pulley plane. */
	at: [number, number];
	/** The belt's direction there, radians from +x. */
	along: number;
}

/**
 * `n` evenly spaced ribs on the belt, moved along by the crank: the belt
 * travels as far as the crank pulley's rim, (crank angle in radians) × its
 * radius. The path's points run the other way round from the belt's motion
 * (the crank turns clockwise seen from the front), so ribs move toward lower u.
 */
export function beltRibs(n: number, crank: number): BeltRib[] {
	const travel = (crank * Math.PI * CRANK_R) / 180;
	const shift = travel / LENGTH;
	return Array.from({ length: n }, (_, index) => {
		const u = (((index / n - shift) % 1) + 1) % 1;
		const p = belt.getPointAt(u);
		const t = belt.getTangentAt(u);
		return { index, u, at: [p.x, p.y], along: Math.atan2(t.y, t.x) };
	});
}
