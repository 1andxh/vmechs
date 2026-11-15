import { describe, it, expect } from 'vitest';
import { ENGINE, wristPinHeight } from '../kinematics';
import { BELT, BELT_THICKNESS, PULLEYS, beltLength, beltRibs } from './drive';
import {
	CYLINDERS,
	FIRING_ORDER,
	cylinderCycle,
	crankAt,
	pistonTravel,
	pulleyTurn,
	throwAngle,
	turboTurn
} from './kinematics';

const DEG = Math.PI / 180;
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
/** Angle difference folded into [0, 360). */
const mod360 = (a: number) => ((a % 360) + 360) % 360;

describe('the V8 fires in order 1-8-4-3-6-5-7-2, one cylinder every 90°', () => {
	it('starts each power stroke in firing order, 90° of crank apart', () => {
		FIRING_ORDER.forEach((n, k) => {
			// cycle angle 360 is the start of the power stroke (lesson convention)
			expect(cylinderCycle(n, k * 90)).toBeCloseTo(360);
		});
	});

	it('has exactly one cylinder starting its power stroke at each 90° step', () => {
		for (let crank = 0; crank < 720; crank += 90) {
			const firing = CYLINDERS.filter((c) => near(cylinderCycle(c.n, crank), 360));
			expect(firing).toHaveLength(1);
		}
	});

	it('puts each piston at the top (TDC) as it fires', () => {
		FIRING_ORDER.forEach((n, k) => expect(pistonTravel(n, k * 90)).toBeCloseTo(0));
	});

	it('numbers cylinders the usual way: odd on the left bank, 1 at the front', () => {
		expect(CYLINDERS.filter((c) => c.bank === 'left').map((c) => c.n)).toEqual([1, 3, 5, 7]);
		expect(CYLINDERS.filter((c) => c.bank === 'right').map((c) => c.n)).toEqual([2, 4, 6, 8]);
		expect(CYLINDERS.find((c) => c.n === 1)?.index).toBe(0);
	});
});

describe('the crankshaft drawing agrees with the pistons (cross-plane crank)', () => {
	it('points each crank pin straight up its own bore when that piston is at TDC', () => {
		FIRING_ORDER.forEach((n, k) => {
			const c = CYLINDERS.find((x) => x.n === n)!;
			const bore = c.bank === 'left' ? -45 : 45;
			expect(mod360(throwAngle(c.index, k * 90) - bore)).toBeCloseTo(0);
		});
	});

	it('keeps every rod the same length in every position (pistons and crank stay connected)', () => {
		const { crankRadius: r, rodLength: l } = ENGINE;
		for (let crank = 0; crank < 720; crank += 7) {
			for (const c of CYLINDERS) {
				const pin = throwAngle(c.index, crank) * DEG;
				const bore = (c.bank === 'left' ? -45 : 45) * DEG;
				const h = wristPinHeight(cylinderCycle(c.n, crank), ENGINE);
				const dx = h * Math.sin(bore) - r * Math.sin(pin);
				const dy = h * Math.cos(bore) - r * Math.cos(pin);
				expect(Math.hypot(dx, dy)).toBeCloseTo(l, 9);
			}
		}
	});

	it('has its four throws in two planes at right angles: 1 and 4 opposite, 2 and 3 opposite', () => {
		const a = [0, 1, 2, 3].map((j) => throwAngle(j, 0));
		expect(mod360(a[3] - a[0])).toBeCloseTo(180);
		expect(mod360(a[2] - a[1])).toBeCloseTo(180);
		expect(mod360(a[1] - a[0]) % 180).toBeCloseTo(90);
	});

	it('turns clockwise seen from the front: the pins move from +x toward −x over the top', () => {
		// seen from the front (looking along +z), +x is on the left, so clockwise
		// over the top means the pin's angle from vertical (toward +x) decreases
		expect(throwAngle(0, 10) - throwAngle(0, 0)).toBeCloseTo(-10);
	});
});

describe('crankAt (the engine clock)', () => {
	it('turns rpm × 6 degrees per second and never wraps, so geared parts never jump', () => {
		expect(crankAt(1, 60)).toBe(360);
		expect(crankAt(10, 60)).toBe(3600);
	});

	it('gives the same cylinder phase a whole cycle (720°) later', () => {
		for (const c of CYLINDERS) {
			expect(cylinderCycle(c.n, 1000 + 720)).toBeCloseTo(cylinderCycle(c.n, 1000));
		}
	});
});

describe('the belt drive', () => {
	it('turns each pulley at crank speed × (crank pulley size ÷ its size)', () => {
		const crank = PULLEYS.find((p) => p.name === 'crank')!;
		const alternator = PULLEYS.find((p) => p.name === 'alternator')!;
		expect(pulleyTurn(alternator, 100)).toBeCloseTo((100 * crank.r) / alternator.r);
		expect(pulleyTurn(crank, 100)).toBeCloseTo(100);
	});

	it('sits on every pulley: its closest approach to each is exactly the rim plus the belt', () => {
		for (const p of PULLEYS) {
			const closest = Math.min(...BELT.map(([x, y]) => Math.hypot(x - p.at[0], y - p.at[1])));
			// never cuts into a pulley, and never floats off one
			expect(closest, p.name).toBeCloseTo(p.r + BELT_THICKNESS / 2, 3);
		}
	});

	it('only drives pulleys inside the belt loop, so every one turns the same way as the crank', () => {
		const inside = (x: number, y: number) => {
			let hit = false;
			for (let i = 0, j = BELT.length - 1; i < BELT.length; j = i++) {
				const [xi, yi] = BELT[i];
				const [xj, yj] = BELT[j];
				if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
			}
			return hit;
		};
		for (const p of PULLEYS) expect(inside(p.at[0], p.at[1]), p.name).toBe(true);
	});
});

describe('the belt moves with the crank pulley', () => {
	const crankPulley = PULLEYS.find((p) => p.name === 'crank')!;

	it('spaces its ribs evenly along the belt', () => {
		const u = beltRibs(24, 0).map((r) => r.u);
		const gaps = u.map((x, i) => (u[(i + 1) % u.length] - x + 1) % 1);
		for (const g of gaps) expect(g).toBeCloseTo(1 / 24, 9);
	});

	it('moves its ribs as far as the crank pulley rim travels', () => {
		const crank = 30;
		const travel = crank * (Math.PI / 180) * crankPulley.r; // rim distance
		const moved = (beltRibs(24, 0)[0].u - beltRibs(24, crank)[0].u + 1) % 1;
		expect(moved * beltLength()).toBeCloseTo(travel, 6);
	});

	it('runs the same way as the crank pulley rim: under the crank, toward +x', () => {
		// the belt's lowest rib sits under the crank pulley; nudge the crank and watch it
		const lowest = (crank: number) =>
			beltRibs(240, crank).reduce((a, b) => (b.at[1] < a.at[1] ? b : a));
		const before = lowest(0);
		const after = beltRibs(240, 0.5).find((r) => r.index === before.index)!;
		expect(after.at[0]).toBeGreaterThan(before.at[0]);
	});
});

describe('turboTurn', () => {
	it('spins the turbo wheel much faster than the crank', () => {
		expect(turboTurn(10)).toBeGreaterThan(10 * 4);
	});
});
