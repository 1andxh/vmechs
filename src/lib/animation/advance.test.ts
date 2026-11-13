import { describe, it, expect } from 'vitest';
import { advance } from './advance';

describe('advance (one animation frame of the driving angle)', () => {
	it('moves forward by speed × elapsed time', () => {
		expect(advance({ angle: 10, dt: 0.5, degPerSec: 100, period: 720 })).toEqual({
			angle: 60,
			stopped: false
		});
	});

	it('wraps past the end of the period back to the start', () => {
		expect(advance({ angle: 700, dt: 1, degPerSec: 100, period: 720 }).angle).toBeCloseTo(80);
	});

	it('stops just before stopAt, so the range being played stays "active"', () => {
		const r = advance({ angle: 170, dt: 1, degPerSec: 100, period: 720, stopAt: 180 });
		expect(r.stopped).toBe(true);
		expect(r.angle).toBeLessThan(180);
		expect(r.angle).toBeGreaterThan(179.99);
	});

	it('stops before the period end instead of wrapping to 0 when stopAt === period', () => {
		const r = advance({ angle: 700, dt: 1, degPerSec: 100, period: 720, stopAt: 720 });
		expect(r.stopped).toBe(true);
		expect(r.angle).toBeGreaterThan(719.99);
	});

	it('keeps going when stopAt is not yet reached', () => {
		expect(advance({ angle: 0, dt: 0.1, degPerSec: 100, period: 720, stopAt: 180 })).toEqual({
			angle: 10,
			stopped: false
		});
	});
});
