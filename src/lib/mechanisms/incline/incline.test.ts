import { describe, it, expect } from 'vitest';
import {
	advantage,
	effortFor,
	frictionFor,
	WOOD_ON_WOOD,
	STEP_SETUPS,
	STEP_SPAN,
	inclineAt
} from './incline';

describe('an inclined plane trades a smaller push for a longer one', () => {
	it('needs a push of load × height ÷ length with no friction', () => {
		expect(effortFor(300, 3, 1)).toBeCloseTo(100);
		expect(effortFor(300, 6, 1)).toBeCloseTo(50);
		expect(effortFor(300, 1.5, 1)).toBeCloseTo(200);
		expect(effortFor(900, 4.8, 1.2)).toBeCloseTo(225); // the lesson's worked example
	});

	it('has an ideal advantage of slope length ÷ height (effort distance ÷ load distance)', () => {
		expect(advantage(3, 1)).toBeCloseTo(3);
		expect(advantage(4, 0.5)).toBeCloseTo(8); // the lesson's practice question
	});

	it('adds friction of μ × the weight pressing into the slope (OpenStax College Physics 5.1)', () => {
		// a 3 m slope 1 m high: cos θ = √8 / 3
		expect(frictionFor(300, 3, 1, WOOD_ON_WOOD)).toBeCloseTo(0.3 * 300 * (Math.sqrt(8) / 3));
		expect(effortFor(300, 3, 1, WOOD_ON_WOOD)).toBeCloseTo(184.9, 1);
		expect(frictionFor(300, 3, 1, 0)).toBe(0);
	});
});

describe('the lesson, step by step', () => {
	const mid = (step: number) => inclineAt(step * STEP_SPAN + STEP_SPAN / 2);

	it('has five steps: ramps 1.5, 3, 3 and 6 m long, then 3 m with friction', () => {
		expect(STEP_SETUPS.map((s) => s.length)).toEqual([1.5, 3, 3, 6, 3]);
		expect(STEP_SETUPS.map((s) => s.mu)).toEqual([0, 0, 0, 0, WOOD_ON_WOOD]);
		expect([0, 1, 2, 3].map((s) => Math.round(mid(s).effort))).toEqual([200, 100, 100, 50]);
		expect(Math.round(mid(4).effort)).toBe(185);
	});

	it('with no friction, work in = work out at every angle', () => {
		for (let angle = 0; angle < STEP_SPAN * 4; angle += 37) {
			const s = inclineAt(angle);
			expect(s.effort * s.effortMoved).toBeCloseTo(s.load * s.loadMoved, 9);
		}
	});

	it('with friction, only about 54% of the work raises the load', () => {
		const s = mid(4);
		expect((s.load * s.loadMoved) / (s.effort * s.effortMoved)).toBeCloseTo(0.541, 3);
		expect(s.advantage).toBeCloseTo(300 / s.effort); // the advantage the forces show
		expect(s.ideal).toBeCloseTo(3);
	});

	it('pushes the block along the slope, raising it by length × sin θ', () => {
		for (const step of [0, 1, 3, 4]) {
			const s = mid(step);
			expect(s.loadMoved).toBeCloseTo((s.effortMoved * s.height) / s.length);
		}
	});

	it('rests at the start of each step and keeps the last step past the end', () => {
		for (let step = 0; step < 5; step++) expect(inclineAt(step * STEP_SPAN).effortMoved).toBe(0);
		expect(inclineAt(STEP_SPAN * 5 + 10).step).toBe(4);
		expect(inclineAt(-5).step).toBe(0);
	});
});
