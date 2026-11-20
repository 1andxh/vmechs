import { describe, it, expect } from 'vitest';
import {
	advantage,
	splitForce,
	opening,
	MAX_DRIVE,
	STEP_SETUPS,
	STEP_SPAN,
	wedgeAt
} from './wedge';

describe('a wedge is two inclined planes back to back, driven into the load', () => {
	it('has an ideal advantage of length ÷ thickness (OpenStax Physics 9.3)', () => {
		expect(advantage(0.6, 0.1)).toBeCloseTo(6);
		expect(advantage(0.12, 0.03)).toBeCloseTo(4); // the lesson's axe head
		expect(advantage(0.05, 0.005)).toBeCloseTo(10); // the lesson's chisel
	});

	it('presses each side apart with the push × length ÷ thickness', () => {
		expect(splitForce(100, 0.6, 0.1)).toBeCloseTo(600);
		expect(splitForce(200, 0.12, 0.03)).toBeCloseTo(800);
	});

	it('opens the wood by its thickness at the depth it has reached', () => {
		expect(opening(0.06, 0.6, 0.1)).toBeCloseTo(0.01);
		expect(opening(0.6, 0.6, 0.1)).toBeCloseTo(0.1); // driven all the way: its full thickness
	});
});

describe('the lesson, step by step', () => {
	const mid = (step: number) => wedgeAt(step * STEP_SPAN + STEP_SPAN / 2);

	it('has five wedges, with advantages 6, 6, 6, 3 and 10', () => {
		expect(STEP_SETUPS).toHaveLength(5);
		expect([0, 1, 2, 3, 4].map((s) => mid(s).advantage)).toEqual(
			[6, 6, 6, 3, 10].map((a) => expect.closeTo(a))
		);
		expect([0, 1, 2, 3, 4].map((s) => Math.round(mid(s).load))).toEqual([600, 600, 600, 300, 1000]);
	});

	it('never gives work for free: push × depth = force apart × opening, at every angle', () => {
		for (let angle = 0; angle < STEP_SPAN * 5; angle += 37) {
			const s = wedgeAt(angle);
			expect(s.effort * s.effortMoved).toBeCloseTo(s.load * s.loadMoved, 9);
		}
	});

	it('a thicker wedge opens the wood twice as far for the same depth', () => {
		expect(mid(3).loadMoved).toBeCloseTo(2 * mid(1).loadMoved);
		expect(mid(3).effortMoved).toBeCloseTo(mid(1).effortMoved);
	});

	it('never drives the wedge deeper than its own length', () => {
		for (const s of STEP_SETUPS) expect(MAX_DRIVE * s.length).toBeLessThan(s.length);
	});

	it('rests at the start of each step and keeps the last step past the end', () => {
		for (let step = 0; step < 5; step++) expect(wedgeAt(step * STEP_SPAN).effortMoved).toBe(0);
		expect(wedgeAt(STEP_SPAN * 5 + 10).step).toBe(4);
		expect(wedgeAt(-5).step).toBe(0);
	});
});
