/**
 * A gear cut into pieces, so a single tooth can be highlighted: one piece
 * per tooth plus a body. The renderers highlight whole objects, so the tooth
 * in contact has to be an object of its own.
 *
 * The cuts run from the middle of each root (half a tooth pitch, π/z, either
 * side of the tooth) straight in to a circle of radius `inner`. Every tooth
 * piece is the same shape, rotated by 2π/z per tooth, and the body's rim uses
 * the same points as the pieces' inner arcs, so the pieces fit with no gap and
 * their flush top faces draw no seam.
 */
import { gearOutline } from './gears.ts';

type P = [number, number];

/** Tooth 0's piece, centred on +x, counter-clockwise: root middle to root middle, then back along `inner`. */
export function toothPiece(z: number, m: number, inner: number, arcSteps: number): P[] {
	const outline = gearOutline(z, m);
	// gearOutline starts at tooth 0's rising flank, so tooth 0's region wraps
	// round the array's end: it starts at the last tooth's root middle (−π/z)
	// and ends at tooth 0's own root middle (+π/z).
	const nearest = (angle: number) => {
		let best = 0;
		let bestOff = Infinity;
		outline.forEach(([x, y], i) => {
			const d = Math.atan2(y, x) - angle;
			const off = Math.abs(Math.atan2(Math.sin(d), Math.cos(d)));
			if (off < bestOff) [best, bestOff] = [i, off];
		});
		return best;
	};
	const start = nearest(-Math.PI / z);
	const end = nearest(Math.PI / z);
	const piece: P[] = [...outline.slice(start), ...outline.slice(0, end + 1)];
	for (let s = 0; s <= arcSteps; s++) {
		const a = Math.PI / z - ((2 * Math.PI) / z) * (s / arcSteps);
		piece.push([inner * Math.cos(a), inner * Math.sin(a)]);
	}
	return piece;
}

/** The body's rim: a circle through every tooth piece's inner arc points, counter-clockwise. */
export function bodyCircle(z: number, inner: number, arcSteps: number): P[] {
	const n = z * arcSteps;
	return Array.from({ length: n }, (_, i) => {
		const a = -Math.PI / z + (2 * Math.PI * i) / n;
		return [inner * Math.cos(a), inner * Math.sin(a)] as P;
	});
}
