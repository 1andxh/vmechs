import { describe, it, expect } from 'vitest';
import { BANKS, DECK, FOUR, at, cylZ, turboAt, type V3 } from './frame';
import {
	THROTTLE_INLET,
	airIn,
	airToPlenum,
	chargePipe,
	collector,
	downPipe,
	flowShift,
	primary,
	runner
} from './plumbing';

const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const first = (p: V3[]) => p[0];
const last = (p: V3[]) => p[p.length - 1];

describe('the air path, from the turbo inlets to every cylinder', () => {
	it('draws air into each compressor from in front, stopping at its wheel', () => {
		for (const b of BANKS) {
			const [tx, ty, tz] = turboAt(b);
			expect(first(airIn(b))[2]).toBeLessThan(last(airIn(b))[2]); // heading in (+z)
			expect(last(airIn(b))).toEqual([tx, ty, tz - 3.0]); // the wheel, inside the intake
		}
	});

	it('carries each bank’s air from the compressor outlet along the charge pipe to the throttle body', () => {
		for (const b of BANKS) expect(dist(last(chargePipe(b)), THROTTLE_INLET)).toBe(0);
	});

	it('carries on from the throttle body along the plenum', () => {
		expect(dist(first(airToPlenum()), THROTTLE_INLET)).toBe(0);
	});

	it('ends every runner at its cylinder’s intake port', () => {
		for (const b of BANKS) {
			for (const i of FOUR) {
				expect(dist(last(runner(b, i)), at(b, DECK + 0.5, -1.5, cylZ(b, i)))).toBe(0);
			}
		}
	});
});

describe('the exhaust path, from every cylinder to the downpipes', () => {
	it('starts each primary at its cylinder’s exhaust port and ends it at the collector', () => {
		for (const b of BANKS) {
			for (const i of FOUR) {
				expect(dist(first(primary(b, i)), at(b, DECK + 0.4, 1.6, cylZ(b, i)))).toBe(0);
				expect(dist(last(primary(b, i)), collector(b))).toBe(0);
			}
		}
	});

	it('leaves each turbine down the downpipe, back (+z) and down toward the exhaust system', () => {
		for (const b of BANKS) {
			const [, ty] = turboAt(b);
			expect(first(downPipe(b))[1]).toBeLessThan(ty); // starts under the turbine
			expect(last(downPipe(b))[2]).toBeGreaterThan(first(downPipe(b))[2]);
			expect(last(downPipe(b))[1]).toBeLessThan(first(downPipe(b))[1]);
		}
	});
});

describe('flowShift', () => {
	it('moves the flow forward as the crank turns, faster with more crank', () => {
		expect(flowShift(0)).toBe(0);
		expect(flowShift(90)).toBeGreaterThan(0);
		expect(flowShift(180)).toBeCloseTo(2 * flowShift(90));
	});
});
