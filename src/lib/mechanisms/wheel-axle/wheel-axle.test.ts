import { describe, it, expect } from 'vitest';
import {
	advantage,
	effortFor,
	ropeTravel,
	MAX_TURN,
	STEP_SETUPS,
	STEP_SPAN,
	wheelAxleAt
} from './wheel-axle';

describe('a wheel and axle is a lever that goes round', () => {
	it('balances when effort × its radius = load × its radius', () => {
		expect(effortFor(300, 0.3, 0.1)).toBeCloseTo(100);
		expect(effortFor(300, 0.6, 0.1)).toBeCloseTo(50);
		expect(effortFor(100, 0.1, 0.3)).toBeCloseTo(300);
	});

	it('has an ideal advantage of wheel radius ÷ axle radius when you turn the wheel', () => {
		expect(advantage(0.3, 0.1)).toBeCloseTo(3);
		// OpenStax College Physics 9.5: a 2.0 cm axle driving a 24.0 cm wheel
		expect(advantage(0.02, 0.24)).toBeCloseTo(0.083, 3);
	});

	it('pays out rope by radius × angle turned, so the rope on the bigger wheel moves further', () => {
		expect(ropeTravel(0.3, Math.PI)).toBeCloseTo(0.3 * Math.PI);
		expect(ropeTravel(0.3, 1) / ropeTravel(0.1, 1)).toBeCloseTo(3);
	});
});

describe('the lesson, step by step', () => {
	it('has five steps, as the lesson file does', () => {
		expect(STEP_SETUPS).toHaveLength(5);
	});

	it('advantage 3 for steps 1 to 3, 6 with the bigger wheel, below 1 driving the axle', () => {
		const at = (step: number) => wheelAxleAt(step * STEP_SPAN + STEP_SPAN / 2);
		expect([0, 1, 2].map((s) => at(s).advantage)).toEqual([3, 3, 3].map((a) => expect.closeTo(a)));
		expect(at(1).effort).toBeCloseTo(100);
		expect(at(1).load).toBeCloseTo(300);
		expect(at(3).advantage).toBeCloseTo(6);
		expect(at(3).effort).toBeCloseTo(50);
		expect(at(4).advantage).toBeCloseTo(1 / 3);
		expect(at(4).driven).toBe('axle');
	});

	it('never gives work for free: effort × its rope travel = load × its rise, at every angle', () => {
		for (let angle = 0; angle < STEP_SPAN * 5; angle += 37) {
			const s = wheelAxleAt(angle);
			expect(s.effort * s.effortMoved).toBeCloseTo(s.load * s.loadMoved, 9);
		}
	});

	it('driving the axle, the rope on the rim moves three times as far as yours', () => {
		const s = wheelAxleAt(4 * STEP_SPAN + STEP_SPAN / 2);
		expect(s.loadMoved / s.effortMoved).toBeCloseTo(3);
	});

	it('rests at the start and end of each step and turns furthest in the middle', () => {
		for (let step = 0; step < 5; step++) {
			expect(wheelAxleAt(step * STEP_SPAN).turn).toBeCloseTo(0);
			expect(wheelAxleAt(step * STEP_SPAN + STEP_SPAN / 2).turn).toBeCloseTo(MAX_TURN);
		}
	});

	it('turns the other way when you drive the axle (its rope hangs on the other side)', () => {
		expect(wheelAxleAt(STEP_SPAN / 2).spin).toBeGreaterThan(0);
		expect(wheelAxleAt(4 * STEP_SPAN + STEP_SPAN / 2).spin).toBeLessThan(0);
	});

	it('keeps the last step past the end of the timeline', () => {
		expect(wheelAxleAt(STEP_SPAN * 5 + 10).step).toBe(4);
		expect(wheelAxleAt(-5).step).toBe(0);
	});
});
