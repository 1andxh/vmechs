import { describe, it, expect } from 'vitest';
import { centreDistance, gearOutline, meshAngle, pitchRadius, ratio } from './gears';

type P = [number, number];
const M = 1; // module: the tooth size

/** Place an outline at a centre, turned by an angle. */
const place = (pts: P[], [cx, cy]: P, a: number): P[] =>
	pts.map(([x, y]) => [
		cx + x * Math.cos(a) - y * Math.sin(a),
		cy + x * Math.sin(a) + y * Math.cos(a)
	]);

/** Is a point inside a closed polygon (ray casting)? */
const inside = ([x, y]: P, poly: P[]) => {
	let hit = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i];
		const [xj, yj] = poly[j];
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
	}
	return hit;
};

describe('gearOutline (an involute tooth profile)', () => {
	const z = 20;
	const pts = gearOutline(z, M);
	const radii = pts.map(([x, y]) => Math.hypot(x, y));

	it('reaches the tip circle (pitch + one module) and the root circle (pitch − 1.25 modules)', () => {
		expect(Math.max(...radii)).toBeCloseTo(pitchRadius(z, M) + M, 6);
		expect(Math.min(...radii)).toBeCloseTo(pitchRadius(z, M) - 1.25 * M, 6);
	});

	it('has one tooth per tooth: z separate stretches at the tip', () => {
		const tip = pitchRadius(z, M) + M;
		const atTip = radii.map((r) => r > tip - 0.05);
		const starts = atTip.filter(
			(v, i) => v && !atTip[(i - 1 + atTip.length) % atTip.length]
		).length;
		expect(starts).toBe(z);
	});

	it('is symmetric: tooth 0 is centred on +x', () => {
		const mirrored = pts.map(([x, y]) => [x, -y] as P);
		for (const p of mirrored.filter((_, i) => i % 7 === 0)) {
			const closest = Math.min(...pts.map(([x, y]) => Math.hypot(x - p[0], y - p[1])));
			expect(closest).toBeLessThan(0.02);
		}
	});
});

describe('a gear pair', () => {
	it('sits its centres one pitch radius each apart: m(z₁ + z₂)/2', () => {
		expect(centreDistance(12, 30, M)).toBe(21);
		expect(centreDistance(12, 30, 2)).toBe(42);
	});

	it('turns the second gear the other way, slower by z₁/z₂', () => {
		const at = (t: number) => meshAngle(t, 12, 30, 0);
		expect(at(0.1) - at(0)).toBeCloseTo(-0.1 * (12 / 30), 9);
	});

	it('multiplies torque (and divides speed) by z₂/z₁', () => {
		expect(ratio(12, 30)).toBeCloseTo(2.5);
		expect(ratio(30, 12)).toBeCloseTo(0.4);
	});

	it('interlocks at every angle: teeth never overlap, yet they touch', () => {
		for (const [z1, z2, dir] of [
			[12, 30, 0],
			[20, 20, 0.7],
			[17, 41, -2]
		]) {
			const a = centreDistance(z1, z2, M);
			const c2: P = [a * Math.cos(dir), a * Math.sin(dir)];
			for (let t = 0; t < (2 * Math.PI) / z1; t += 0.05) {
				const g1 = place(gearOutline(z1, M), [0, 0], t);
				const g2 = place(gearOutline(z2, M), c2, meshAngle(t, z1, z2, dir));
				// no overlap: no point of one gear inside the other
				expect(
					g2.some((p) => inside(p, g1)),
					`${z1}:${z2} at ${t.toFixed(2)}`
				).toBe(false);
				expect(
					g1.some((p) => inside(p, g2)),
					`${z1}:${z2} at ${t.toFixed(2)}`
				).toBe(false);
				// but in mesh: the closest points are within a small clearance
				let near = Infinity; // a loop: spreading every distance into Math.min overflows the stack
				for (const p of g1.filter((p) => Math.hypot(p[0] - c2[0], p[1] - c2[1]) < a)) {
					for (const q of g2) near = Math.min(near, Math.hypot(p[0] - q[0], p[1] - q[1]));
				}
				expect(near, `${z1}:${z2} at ${t.toFixed(2)}`).toBeLessThan(0.12 * M);
			}
		}
	});
});
