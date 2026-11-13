import { describe, it, expect } from 'vitest';
import {
	crankPin,
	pistonDisplacement,
	strokeAt,
	valveLift,
	wristPinHeight,
	type EngineGeometry
} from './kinematics';

// r = 1, l = 3.5 — a typical rod-to-stroke ratio (l / 2r ≈ 1.75).
const g: EngineGeometry = { crankRadius: 1, rodLength: 3.5 };

describe('pistonDisplacement (distance below top dead centre)', () => {
	it('is zero at TDC (0°)', () => {
		expect(pistonDisplacement(0, g)).toBeCloseTo(0);
	});

	it('equals the full stroke, 2r, at BDC (180°)', () => {
		expect(pistonDisplacement(180, g)).toBeCloseTo(2 * g.crankRadius);
	});

	it('is past halfway at 90° because the rod is angled: r + l − √(l² − r²)', () => {
		const { crankRadius: r, rodLength: l } = g;
		const expected = r + l - Math.sqrt(l * l - r * r);
		expect(pistonDisplacement(90, g)).toBeCloseTo(expected);
		expect(expected).toBeGreaterThan(r); // the teaching point, made explicit
	});

	it('repeats every crank revolution (360°)', () => {
		expect(pistonDisplacement(360 + 47, g)).toBeCloseTo(pistonDisplacement(47, g));
	});

	it('rejects geometry where the rod is not longer than the crank throw', () => {
		expect(() => pistonDisplacement(90, { crankRadius: 2, rodLength: 2 })).toThrow(/rodLength/);
	});
});

describe('crankPin (where the rod attaches to the crank)', () => {
	it('is straight up at TDC and to the right at 90° (clockwise rotation)', () => {
		expect(crankPin(0, g).x).toBeCloseTo(0);
		expect(crankPin(0, g).y).toBeCloseTo(g.crankRadius);
		expect(crankPin(90, g).x).toBeCloseTo(g.crankRadius);
		expect(crankPin(90, g).y).toBeCloseTo(0);
	});

	it('is always exactly one rod length from the wrist pin (the rod never stretches)', () => {
		for (let deg = 0; deg < 720; deg += 7) {
			const p = crankPin(deg, g);
			const len = Math.hypot(p.x - 0, p.y - wristPinHeight(deg, g));
			expect(len).toBeCloseTo(g.rodLength, 9);
		}
	});
});

describe('strokeAt (4-stroke cycle = 720° = two crank turns)', () => {
	it.each([
		[90, 'intake'],
		[270, 'compression'],
		[450, 'power'],
		[630, 'exhaust']
	] as const)('%i° is the %s stroke', (deg, stroke) => {
		expect(strokeAt(deg)).toBe(stroke);
	});

	it('wraps angles outside 0–720°, including negative ones', () => {
		expect(strokeAt(720 + 270)).toBe('compression');
		expect(strokeAt(-90)).toBe('exhaust');
	});
});

describe('valveLift (0 = closed, 1 = fully open; idealized timing)', () => {
	it('opens the intake valve fully mid-intake (90°)', () => {
		expect(valveLift(90, 'intake')).toBeCloseTo(1);
	});

	it('keeps the intake valve closed during compression, power and exhaust', () => {
		for (const deg of [270, 450, 630]) expect(valveLift(deg, 'intake')).toBe(0);
	});

	it('opens the exhaust valve fully mid-exhaust (630°)', () => {
		expect(valveLift(630, 'exhaust')).toBeCloseTo(1);
	});

	it('keeps the exhaust valve closed during intake, compression and power', () => {
		for (const deg of [90, 270, 450]) expect(valveLift(deg, 'exhaust')).toBe(0);
	});
});
