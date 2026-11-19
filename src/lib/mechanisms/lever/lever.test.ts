import { describe, it, expect } from 'vitest';
import {
	advantage,
	effortFor,
	endTravel,
	layout,
	push,
	STEP_SETUPS,
	MAX_TILT,
	formatAdvantage,
	leverAt,
	type LeverClass
} from './lever';

describe('the law of the lever', () => {
	it('balances when effort × effort arm = load × load arm', () => {
		expect(effortFor(300, 3, 1)).toBeCloseTo(100);
		expect(effortFor(100, 1, 1)).toBeCloseTo(100);
		expect(effortFor(100, 1, 3)).toBeCloseTo(300);
		for (const [load, e, l] of [
			[250, 2.5, 0.8],
			[40, 0.3, 1.7]
		]) {
			expect(effortFor(load, e, l) * e).toBeCloseTo(load * l, 9);
		}
	});

	it('gives a mechanical advantage of effort arm ÷ load arm, which is load ÷ effort', () => {
		expect(advantage(3, 1)).toBeCloseTo(3);
		expect(advantage(1, 3)).toBeCloseTo(1 / 3);
		expect(300 / effortFor(300, 3, 1)).toBeCloseTo(advantage(3, 1));
	});

	it('never gives work for free: effort × its travel = load × its travel', () => {
		for (const [load, e, l] of [
			[300, 3, 1],
			[100, 1, 3],
			[80, 2, 2]
		]) {
			for (const tilt of [0.05, 0.2, 0.4]) {
				const work = (force: number, arm: number) => force * endTravel(arm, tilt);
				expect(work(effortFor(load, e, l), e)).toBeCloseTo(work(load, l), 9);
			}
		}
	});
});

describe('the three classes', () => {
	// arms that fit each class: in class 3 the effort is the nearer force
	const arms = (cls: LeverClass): [number, number] => (cls === 3 ? [1, 2] : [2, 1]);
	const middle = (cls: LeverClass) => {
		const { fulcrum, load, effort } = layout(cls, ...arms(cls));
		return Object.entries({ fulcrum, load, effort }).sort((a, b) => a[1] - b[1])[1][0];
	};

	it('puts the fulcrum, the load or the effort in the middle', () => {
		expect(middle(1)).toBe('fulcrum');
		expect(middle(2)).toBe('load');
		expect(middle(3)).toBe('effort');
	});

	it('refuses arms that would make it a different class', () => {
		expect(() => layout(3, 2, 1)).toThrow(/class 3/);
		expect(() => layout(2, 1, 2)).toThrow(/class 2/);
	});

	it('places each force its arm away from the fulcrum', () => {
		for (const cls of [1, 2, 3] as LeverClass[]) {
			const { fulcrum, load, effort } = layout(cls, cls === 3 ? 1 : 2.5, cls === 3 ? 2.5 : 1);
			expect(Math.abs(effort - fulcrum)).toBeCloseTo(cls === 3 ? 1 : 2.5);
			expect(Math.abs(load - fulcrum)).toBeCloseTo(cls === 3 ? 2.5 : 1);
		}
	});

	it('moves the load the other way to the effort only in the first class', () => {
		for (const cls of [1, 2, 3] as LeverClass[]) {
			const { fulcrum, load, effort } = layout(cls, ...arms(cls));
			const sameSide = Math.sign(load - fulcrum) === Math.sign(effort - fulcrum);
			expect(sameSide).toBe(cls !== 1);
		}
	});
});

describe('the push (one step = 360°)', () => {
	it('starts and ends at rest, and is fully pushed halfway', () => {
		expect(push(0)).toBeCloseTo(0);
		expect(push(180)).toBeCloseTo(1);
		expect(push(360)).toBeCloseTo(0);
	});
});

describe('the five steps', () => {
	it('tell the story: equal arms, then 3× advantage, then the second and third class', () => {
		expect(STEP_SETUPS.map((s) => s.cls)).toEqual([1, 1, 1, 2, 3]);
		expect(STEP_SETUPS.map((s) => advantage(s.effortArm, s.loadArm))).toEqual([1, 3, 3, 3, 1 / 3]);
	});

	it('keeps the load at 300 N from the advantage step on, so the effort tells the story', () => {
		expect(STEP_SETUPS.slice(1).map((s) => s.load)).toEqual([300, 300, 300, 300]);
		expect(STEP_SETUPS.slice(1).map((s) => effortFor(s.load, s.effortArm, s.loadArm))).toEqual([
			100, 100, 100, 900
		]);
	});
});

describe('leverAt (everything the stage shows, from the one angle)', () => {
	it('picks the step from the angle, 360° per step', () => {
		expect(leverAt(0).step).toBe(0);
		expect(leverAt(359).step).toBe(0);
		expect(leverAt(400).step).toBe(1);
		expect(leverAt(1799).step).toBe(4);
		expect(leverAt(1800).step).toBe(4); // the very end stays on the last step
	});

	it('is at rest at the start of each step and fully tilted halfway through', () => {
		expect(leverAt(360).tilt).toBeCloseTo(0);
		expect(leverAt(540).tilt).toBeCloseTo(MAX_TILT);
	});

	it("reports the step's forces and advantage", () => {
		const s = leverAt(540);
		expect([s.effort, s.load]).toEqual([100, 300]);
		expect(s.advantage).toBeCloseTo(3);
		expect(leverAt(1620).effort).toBeCloseTo(900);
	});

	it('moves the ends in the ratio of their arms', () => {
		const s = leverAt(900); // step 3, fully pushed
		expect(s.effortMoved / s.loadMoved).toBeCloseTo(3);
		expect(leverAt(720).effortMoved).toBeCloseTo(0);
	});
});

describe('formatAdvantage', () => {
	it('writes whole numbers as 3×, and advantages below 1 as a fraction', () => {
		expect(formatAdvantage(1)).toBe('1×');
		expect(formatAdvantage(3)).toBe('3×');
		expect(formatAdvantage(1 / 3)).toBe('⅓×');
		expect(formatAdvantage(2.5)).toBe('2.5×');
	});
});
