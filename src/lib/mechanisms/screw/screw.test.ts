import { describe, it, expect } from 'vitest';
import {
	advantage,
	effortFor,
	rise,
	handTravel,
	MAX_TURNS,
	STEP_SETUPS,
	STEP_SPAN,
	screwAt
} from './screw';

describe('a screw is an inclined plane wrapped round a rod, turned by a lever', () => {
	it('has an ideal advantage of 2π × the radius you turn it at ÷ the pitch', () => {
		// OpenStax Physics 9.3: the input distance is the circumference, the output the pitch
		expect(advantage(0.3, 0.02)).toBeCloseTo((2 * Math.PI * 0.3) / 0.02);
		expect(advantage(0.015, 0.003)).toBeCloseTo(31.4, 1); // the lesson's screwdriver
		expect(advantage(0.25, 0.005)).toBeCloseTo(314.2, 1); // the lesson's practice jack
	});

	it('needs a push of load × pitch ÷ (2π × radius)', () => {
		expect(effortFor(3000, 0.3, 0.02)).toBeCloseTo(31.83, 2);
		expect(effortFor(3000, 0.05, 0.02)).toBeCloseTo(191.0, 1);
		expect(effortFor(5000, 0.25, 0.005)).toBeCloseTo(15.9, 1);
	});

	it('rises one pitch per turn while your hand goes once round its circle', () => {
		expect(rise(1, 0.02)).toBeCloseTo(0.02);
		expect(rise(2, 0.01)).toBeCloseTo(0.02);
		expect(handTravel(1, 0.3)).toBeCloseTo(1.885, 3); // "nearly two metres"
	});
});

describe('the lesson, step by step', () => {
	const mid = (step: number) => screwAt(step * STEP_SPAN + STEP_SPAN / 2);

	it('turns the bare screw, then adds a handle, then a finer thread', () => {
		expect(STEP_SETUPS.map((s) => s.radius)).toEqual([0.05, 0.05, 0.3, 0.3, 0.3]);
		expect(STEP_SETUPS.map((s) => s.pitch)).toEqual([0.02, 0.02, 0.02, 0.02, 0.01]);
		expect([0, 1, 2, 3, 4].map((s) => Math.round(mid(s).effort))).toEqual([191, 191, 32, 32, 16]);
		expect(STEP_SETUPS.map((s) => s.handle)).toEqual([false, false, true, true, true]);
	});

	it('never gives work for free: push × hand travel = load × rise, at every angle', () => {
		for (let angle = 0; angle < STEP_SPAN * 5; angle += 37) {
			const s = screwAt(angle);
			expect(s.effort * s.effortMoved).toBeCloseTo(s.load * s.loadMoved, 6);
		}
	});

	it('turns twice in each step: the finer thread lifts half as far', () => {
		expect(mid(2).turns).toBeCloseTo(MAX_TURNS);
		expect(mid(2).loadMoved).toBeCloseTo(0.04);
		expect(mid(4).loadMoved).toBeCloseTo(0.02);
	});

	it('rests at the start of each step and keeps the last step past the end', () => {
		for (let step = 0; step < 5; step++) expect(screwAt(step * STEP_SPAN).turns).toBe(0);
		expect(screwAt(STEP_SPAN * 5 + 10).step).toBe(4);
		expect(screwAt(-5).step).toBe(0);
	});
});
