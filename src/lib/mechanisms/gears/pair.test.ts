import { describe, it, expect } from 'vitest';
import { centreDistance, gearOutline, meshAngle } from './gears';
import { contactTeeth, cyclePeriod } from './pair';

type P = [number, number];
const M = 1;
const TAU = 2 * Math.PI;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** An angle folded into [0, 2π), so "the same direction" compares equal. */
const fold = (a: number) => ((a % TAU) + TAU) % TAU;

describe('cyclePeriod (how far the driver turns before both gears are back where they started)', () => {
	it('is five turns of a 12-tooth driver against 30 teeth, which turn twice', () => {
		expect(cyclePeriod(12, 30)).toBe(1800);
	});

	it('is one turn for equal gears, and two for a 2:1 pair', () => {
		expect(cyclePeriod(20, 20)).toBe(360);
		expect(cyclePeriod(12, 24)).toBe(720);
	});

	it('brings both gears back to their starting angles, and no shorter whole number of turns does', () => {
		for (const [z1, z2] of [
			[12, 30],
			[17, 40],
			[15, 25]
		]) {
			const period = cyclePeriod(z1, z2);
			expect(period > 0 && period % 360 === 0, `${z1}:${z2} is whole turns`).toBe(true);
			const start = meshAngle(0, z1, z2, 0);
			const end = meshAngle(rad(period), z1, z2, 0);
			// fold(a) near 0 or near 2π both mean "back at the start"
			const off = Math.min(fold(end - start), TAU - fold(end - start));
			expect(off, `${z1}:${z2}`).toBeLessThan(1e-9);
			for (let turns = 1; turns < period / 360; turns++) {
				const e = meshAngle(rad(turns * 360), z1, z2, 0);
				const o = Math.min(fold(e - start), TAU - fold(e - start));
				expect(o, `${z1}:${z2} after ${turns} turns`).toBeGreaterThan(1e-6);
			}
		}
	});
});

describe('contactTeeth (the pair of teeth doing the work)', () => {
	const z1 = 12;
	const z2 = 30;
	const a = centreDistance(z1, z2, M);
	const driver = gearOutline(z1, M);
	const driven = gearOutline(z2, M);

	/** World-space points of tooth k of a gear, optionally only its leading (+angle) half. */
	const tooth = (
		outline: P[],
		z: number,
		k: number,
		centre: P,
		turn: number,
		leading = false
	): P[] =>
		outline
			.filter(([x, y]) => {
				// angle of the point from this tooth's centre line, in (-π, π]
				let d = Math.atan2(y, x) - (TAU * k) / z;
				d = Math.atan2(Math.sin(d), Math.cos(d));
				return leading ? d >= 0 && d < Math.PI / z : Math.abs(d) < Math.PI / z;
			})
			.map(([x, y]) => [
				centre[0] + x * Math.cos(turn) - y * Math.sin(turn),
				centre[1] + x * Math.sin(turn) + y * Math.cos(turn)
			]);

	const gap = (p: P[], q: P[]) =>
		Math.min(...p.map(([x, y]) => Math.min(...q.map(([u, v]) => Math.hypot(x - u, y - v)))));

	// several tooth pitches, at steps that don't line up with a pitch
	const angles = Array.from({ length: 60 }, (_, i) => i * 0.037);

	it('picks the driver tooth nearest the line between the centres', () => {
		for (const t of angles) {
			const [k] = contactTeeth(t, z1, z2);
			const centreLine = fold(t + (TAU * k) / z1); // the tooth's world angle; the line is at 0
			expect(Math.min(centreLine, TAU - centreLine), `t=${t.toFixed(3)}`).toBeLessThanOrEqual(
				Math.PI / z1 + 1e-9
			);
		}
	});

	it("picks the driven tooth that the driver tooth's leading side is pushing", () => {
		for (const t of angles) {
			const [k, j] = contactTeeth(t, z1, z2);
			const turn2 = meshAngle(t, z1, z2, 0);
			const pushing = tooth(driver, z1, k, [0, 0], t, true);
			const gaps = Array.from({ length: z2 }, (_, i) =>
				gap(pushing, tooth(driven, z2, i, [a, 0], turn2))
			);
			const nearest = gaps.indexOf(Math.min(...gaps));
			expect(j, `t=${t.toFixed(3)}`).toBe(nearest);
			expect(gaps[j], `t=${t.toFixed(3)}`).toBeLessThan(0.12 * M); // touching
		}
	});

	it('returns tooth numbers in range, at any angle including negative and many turns', () => {
		for (const t of [-7.3, -0.01, 0, 25.9, 1000]) {
			const [k, j] = contactTeeth(t, z1, z2);
			expect(Number.isInteger(k) && k >= 0 && k < z1, `k at ${t}`).toBe(true);
			expect(Number.isInteger(j) && j >= 0 && j < z2, `j at ${t}`).toBe(true);
		}
	});
});
