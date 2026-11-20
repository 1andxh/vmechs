import { describe, it, expect } from 'vitest';
import {
	effortFor,
	ropePulled,
	routing,
	ropeThrough,
	MAX_LIFT,
	STEP_SETUPS,
	STEP_SPAN,
	pulleyAt
} from './pulley';

describe('a pulley system shares the load between the ropes that hold it', () => {
	it('needs an effort of load ÷ the number of ropes holding the load', () => {
		expect([1, 2, 3, 4].map((n) => effortFor(300, n))).toEqual([300, 150, 100, 75]);
	});

	it('takes N metres of rope to lift the load one metre (OpenStax Physics 9.3)', () => {
		expect(ropePulled(4, 1)).toBe(4);
		expect(ropePulled(2, 0.25)).toBeCloseTo(0.5);
	});
});

describe('how the rope is threaded', () => {
	it('has one pulley joining each pair of neighbouring ropes, ending over a fixed one', () => {
		for (const n of [1, 2, 3, 4]) {
			const r = routing(n);
			expect(r.joins).toHaveLength(n);
			expect(r.joins.at(-1)).toBe('top'); // your rope comes down off a fixed pulley
			// fixed and moving pulleys alternate along the rope
			for (let k = 1; k < n; k++) expect(r.joins[k]).not.toBe(r.joins[k - 1]);
		}
	});

	it('ties the rope to the beam for an even number of ropes, to the moving pulleys for an odd one', () => {
		expect(routing(2).anchor).toBe('top');
		expect(routing(4).anchor).toBe('top');
		expect(routing(1).anchor).toBe('bottom');
		expect(routing(3).anchor).toBe('bottom');
	});

	it('uses the pulleys in the OpenStax figures: 1 fixed; 1 fixed and 1 moving; 2 and 1; 2 and 2', () => {
		const count = (n: number) => {
			const j = routing(n).joins;
			return [j.filter((x) => x === 'top').length, j.filter((x) => x === 'bottom').length];
		};
		expect(count(1)).toEqual([1, 0]);
		expect(count(2)).toEqual([1, 1]);
		expect(count(3)).toEqual([2, 1]);
		expect(count(4)).toEqual([2, 2]);
	});

	it('runs more rope through each pulley along the way, all of it through the last', () => {
		// each rope holding the load shortens by the lift, so the rope that has passed
		// the k-th pulley is the k ropes before it, each shortened by the lift
		expect(ropeThrough(0, 0.2)).toBeCloseTo(0.2);
		expect(ropeThrough(3, 0.2)).toBeCloseTo(0.8);
		expect(ropeThrough(3, 0.2)).toBeCloseTo(ropePulled(4, 0.2));
	});
});

describe('the lesson, step by step', () => {
	const mid = (step: number) => pulleyAt(step * STEP_SPAN + STEP_SPAN / 2);

	it('has five steps, holding the load with 1, 2, 2, 4 and 3 ropes', () => {
		expect(STEP_SETUPS.map((s) => s.ropes)).toEqual([1, 2, 2, 4, 3]);
		expect([0, 1, 2, 3, 4].map((s) => mid(s).effort)).toEqual([300, 150, 150, 75, 100]);
		expect([0, 1, 2, 3, 4].map((s) => mid(s).advantage)).toEqual([1, 2, 2, 4, 3]);
	});

	it('never gives work for free: effort × rope pulled = load × lift, at every angle', () => {
		for (let angle = 0; angle < STEP_SPAN * 5; angle += 37) {
			const s = pulleyAt(angle);
			expect(s.effort * s.effortMoved).toBeCloseTo(s.load * s.loadMoved, 9);
		}
	});

	it('rests at the start of each step and lifts furthest in the middle', () => {
		for (let step = 0; step < 5; step++) {
			expect(pulleyAt(step * STEP_SPAN).lift).toBeCloseTo(0);
			expect(mid(step).lift).toBeCloseTo(MAX_LIFT);
		}
	});

	it('keeps the last step past the end of the timeline', () => {
		expect(pulleyAt(STEP_SPAN * 5 + 10).step).toBe(4);
		expect(pulleyAt(-5).step).toBe(0);
	});
});
