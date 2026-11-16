import { describe, it, expect } from 'vitest';
import { gearOutline, pitchRadius } from './gears';
import { bodyCircle, toothPiece } from './pieces';

type P = [number, number];
const M = 1;

/** Signed area of a polygon (shoelace): positive when counter-clockwise. */
const area = (poly: P[]) =>
	poly.reduce((s, [x, y], i) => {
		const [u, v] = poly[(i + 1) % poly.length];
		return s + (x * v - u * y) / 2;
	}, 0);

describe('a gear split into a body and one piece per tooth', () => {
	for (const z of [12, 30]) {
		const inner = pitchRadius(z, M) - 2 * M; // inside the root circle
		const piece = toothPiece(z, M, inner, 4);
		const body = bodyCircle(z, inner, 4);

		it(`${z} teeth: the pieces and the body cover exactly the gear's outline`, () => {
			expect(z * area(piece) + area(body)).toBeCloseTo(area(gearOutline(z, M)), 9);
		});

		it(`${z} teeth: the piece is counter-clockwise and reaches the tip circle`, () => {
			expect(area(piece)).toBeGreaterThan(0);
			const radii = piece.map(([x, y]) => Math.hypot(x, y));
			expect(Math.max(...radii)).toBeCloseTo(pitchRadius(z, M) + M, 6);
			expect(Math.min(...radii)).toBeCloseTo(inner, 9);
		});

		it(`${z} teeth: the piece spans exactly one tooth pitch, centred on +x`, () => {
			const angles = piece.map(([x, y]) => Math.atan2(y, x));
			expect(Math.min(...angles)).toBeCloseTo(-Math.PI / z, 9);
			expect(Math.max(...angles)).toBeCloseTo(Math.PI / z, 9);
		});

		it(`${z} teeth: the body's rim meets each piece's inner arc point for point`, () => {
			// pieces' inner arc points, all teeth, must all be points of the body
			const arc = piece.filter(([x, y]) => Math.abs(Math.hypot(x, y) - inner) < 1e-9);
			expect(arc.length).toBe(4 + 1); // arcSteps segments, so one more point
			for (let k = 0; k < z; k++) {
				const a = (2 * Math.PI * k) / z;
				for (const [x, y] of arc) {
					const p: P = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
					const d = Math.min(...body.map(([u, v]) => Math.hypot(u - p[0], v - p[1])));
					expect(d).toBeLessThan(1e-9);
				}
			}
		});
	}
});
