import { describe, it, expect } from 'vitest';
import {
	STAGES,
	VIEWS,
	cameraAt,
	explodeAt,
	follow,
	stageAt,
	tourProgress,
	type View
} from './explode';

const MOVING = ['intake', 'turbos', 'front', 'heads'] as const;

describe('tourProgress (scroll → 0..1, one screen per stage)', () => {
	const last = STAGES.length - 1;

	it('is 0 until the tour reaches the top of the viewport', () => {
		expect(tourProgress(200, 1000)).toBe(0);
		expect(tourProgress(0, 1000)).toBe(0);
	});

	it('moves one stage per screen scrolled', () => {
		expect(tourProgress(-1000, 1000)).toBeCloseTo(1 / last);
		expect(tourProgress(-2500, 1000)).toBeCloseTo(2.5 / last);
	});

	it('stops at 1 after the last stage', () => {
		expect(tourProgress(-last * 1000, 1000)).toBe(1);
		expect(tourProgress(-99999, 1000)).toBe(1);
	});
});

describe('explodeAt (how far each part group has come out)', () => {
	const seg = 1 / (STAGES.length - 1);
	const apart = STAGES.findIndex((s) => s.group === 'heads') * seg; // the last group is out

	it('starts assembled, comes fully apart, and is back together at the end', () => {
		for (const g of MOVING) {
			expect(explodeAt(0)[g]).toBe(0);
			expect(explodeAt(apart)[g]).toBe(1);
			expect(explodeAt(1)[g]).toBe(0);
		}
	});

	it('takes the groups out one at a time, in stage order', () => {
		// halfway to the turbos' stop: intake is out, turbos moving, the rest still in
		const e = explodeAt(1.5 * seg);
		expect(e.intake).toBe(1);
		expect(e.turbos).toBeGreaterThan(0);
		expect(e.turbos).toBeLessThan(1);
		expect(e.front).toBe(0);
		expect(e.heads).toBe(0);
	});

	it('has each group fully out when its sentence is in place', () => {
		MOVING.forEach((g) => {
			const i = STAGES.findIndex((s) => s.group === g);
			expect(explodeAt(i * seg)[g]).toBe(1);
		});
	});

	it('only takes parts out on the way to the last group, and only puts them back after', () => {
		// whole steps of 0.01, each judged by both ends, so float drift can't
		// put a step on the wrong side of the turning point
		for (let k = 1; k <= 100; k++) {
			const [from, to] = [(k - 1) / 100, k / 100];
			const [a, b] = [explodeAt(from), explodeAt(to)];
			for (const g of MOVING) {
				if (to <= apart + 1e-9) expect(b[g]).toBeGreaterThanOrEqual(a[g]);
				if (from >= apart - 1e-9) expect(b[g]).toBeLessThanOrEqual(a[g]);
			}
		}
	});
});

describe('cameraAt (one view per stage, blended as you scroll)', () => {
	const last = STAGES.length - 1;
	const gap = (a: View, b: View) =>
		Math.max(
			...[0, 1, 2].flatMap((k) => [Math.abs(a.eye[k] - b.eye[k]), Math.abs(a.look[k] - b.look[k])])
		);

	it('has a view for every stage, and shows it exactly at that stage', () => {
		expect(VIEWS).toHaveLength(STAGES.length);
		VIEWS.forEach((v, i) => expect(gap(cameraAt(i), v)).toBe(0));
	});

	it('moves smoothly between views, with no jumps', () => {
		for (let t = 0; t < last; t += 0.01)
			expect(gap(cameraAt(t), cameraAt(t + 0.01))).toBeLessThan(0.5);
	});

	it('stays between the two views it is blending', () => {
		for (let t = 0.05; t < last; t += 0.1) {
			const [a, b, c] = [VIEWS[Math.floor(t)], VIEWS[Math.floor(t) + 1], cameraAt(t)];
			for (const k of [0, 1, 2]) {
				expect(c.eye[k]).toBeGreaterThanOrEqual(Math.min(a.eye[k], b.eye[k]) - 1e-9);
				expect(c.eye[k]).toBeLessThanOrEqual(Math.max(a.eye[k], b.eye[k]) + 1e-9);
			}
		}
	});

	it('holds the first and last views beyond the ends of the tour', () => {
		expect(gap(cameraAt(-1), VIEWS[0])).toBe(0);
		expect(gap(cameraAt(last + 2), VIEWS[last])).toBe(0);
	});
});

describe('stageAt (which sentence, and which part, is current)', () => {
	it('follows the sentence nearest the scroll position', () => {
		const seg = 1 / (STAGES.length - 1);
		expect(stageAt(0)).toBe(0);
		expect(stageAt(0.4 * seg)).toBe(0);
		expect(stageAt(0.6 * seg)).toBe(1);
		expect(stageAt(1)).toBe(STAGES.length - 1);
	});
});

describe('follow (the drawing glides after the scroll position)', () => {
	it('moves part of the way toward the target each frame, never past it', () => {
		const next = follow(0, 1, 1 / 60);
		expect(next).toBeGreaterThan(0);
		expect(next).toBeLessThan(1);
		expect(follow(1, 0, 1 / 60)).toBeLessThan(1);
		expect(follow(1, 0, 1 / 60)).toBeGreaterThan(0);
	});

	it('looks the same at any frame rate: two half frames equal one whole frame', () => {
		const once = follow(0, 1, 1 / 30);
		const twice = follow(follow(0, 1, 1 / 60), 1, 1 / 60);
		expect(twice).toBeCloseTo(once, 10);
	});

	it('lands exactly on the target once it is close enough', () => {
		expect(follow(0.99999, 1, 1 / 60)).toBe(1);
	});
});
